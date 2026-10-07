const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

// ==========================================
// MIDDLEWARE: Verify JWT Token
// ==========================================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = decoded;
        next();
    });
};

// ==========================================
// MIDDLEWARE: Verify Mentor Role
// ==========================================
const isMentor = (req, res, next) => {
    if (req.user.role !== 'mentor') {
        return res.status(403).json({ error: 'Access denied. Mentors only.' });
    }
    next();
};

// ==========================================
// AUTH ROUTES
// ==========================================

// POST — Register (mentor or student)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!['mentor', 'student'].includes(role)) {
            return res.status(400).json({ error: 'Role must be mentor or student.' });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Registration successful!', token, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST — Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// ROADMAP ROUTES
// ==========================================

// GET — All public roadmaps (no auth needed — anyone can browse)
app.get('/api/roadmaps', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.id, r.title, r.description, r.created_at, u.name AS mentor_name
             FROM roadmaps r
             JOIN users u ON r.mentor_id = u.id
             WHERE r.is_public = true
             ORDER BY r.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET — Single roadmap with its topics
app.get('/api/roadmaps/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const roadmap = await pool.query(
            `SELECT r.*, u.name AS mentor_name
             FROM roadmaps r
             JOIN users u ON r.mentor_id = u.id
             WHERE r.id = $1`,
            [id]
        );

        if (roadmap.rows.length === 0) {
            return res.status(404).json({ error: 'Roadmap not found.' });
        }

        const topics = await pool.query(
            'SELECT * FROM topics WHERE roadmap_id = $1 ORDER BY order_index ASC',
            [id]
        );

        res.json({ ...roadmap.rows[0], topics: topics.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student progress for a specific roadmap
app.get('/api/roadmaps/:id/progress', verifyToken, async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const userId = req.user.id;

    // Advanced SQL: Count total topics AND completed topics in one query
        // Advanced SQL: Count total topics AND completed topics in one query
    const progressQuery = `
      SELECT 
        COUNT(t.id)::int AS total_topics,
        COUNT(tp.id)::int AS completed_topics
      FROM topics t
      LEFT JOIN topic_progress tp 
        ON t.id = tp.topic_id AND tp.student_id = $1
      WHERE t.roadmap_id = $2;
    `;

    const result = await pool.query(progressQuery, [userId, roadmapId]);
    
    const total = result.rows[0].total_topics;
    const completed = result.rows[0].completed_topics;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({ total, completed, percentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching progress' });
  }
});

// Get a list of completed topic IDs for a specific student
app.get('/api/roadmaps/:id/completed-topics', verifyToken, async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const studentId = req.user.id;

    const query = `
      SELECT topic_id 
      FROM topic_progress tp
      JOIN topics t ON tp.topic_id = t.id
      WHERE tp.student_id = $1 AND t.roadmap_id = $2;
    `;
    
    const result = await pool.query(query, [studentId, roadmapId]);
    
    // Map the result rows into a simple array of IDs: [1, 4, 5]
    const completedIds = result.rows.map(row => row.topic_id);
    
    res.json(completedIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching completed topics' });
  }
});

// POST — Create a roadmap (mentors only)
app.post('/api/roadmaps', verifyToken, isMentor, async (req, res) => {
    try {
        const { title, description, is_public } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        const result = await pool.query(
            'INSERT INTO roadmaps (title, description, mentor_id, is_public) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, req.user.id, is_public || false]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST — Add a topic to a roadmap (mentor only)
app.post('/api/roadmaps/:id/topics', verifyToken, isMentor, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, order_index } = req.body;

        if (!title || order_index === undefined) {
            return res.status(400).json({ error: 'Title and order_index are required.' });
        }

        const result = await pool.query(
            'INSERT INTO topics (roadmap_id, title, description, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, title, description, order_index]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST — Enroll a student in a roadmap (student only)
app.post('/api/enrollments', verifyToken, async (req, res) => {
    try {
        const { roadmap_id } = req.body;

        if (req.user.role === 'mentor') {
            return res.status(403).json({ error: 'Mentors cannot enroll in roadmaps.' });
        }

        const result = await pool.query(
            'INSERT INTO enrollments (student_id, roadmap_id) VALUES ($1, $2) RETURNING *',
            [req.user.id, roadmap_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Already enrolled in this roadmap.' });
        }
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST — Mark a topic as complete (student only)
app.post('/api/progress', verifyToken, async (req, res) => {
    try {
        const { topic_id } = req.body;

        const result = await pool.query(
            'INSERT INTO topic_progress (student_id, topic_id) VALUES ($1, $2) RETURNING *',
            [req.user.id, topic_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Topic already marked as complete.' });
        }
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`MentorTrack server running on http://localhost:${PORT}`);
});