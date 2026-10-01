const BASE = 'http://localhost:5003';

async function post(endpoint, body, token) {
    const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(body)
    });
    return res.json();
}

async function get(endpoint, token) {
    const res = await fetch(`${BASE}${endpoint}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
}

async function runTests() {
    console.log('\n===== MENTORTRACK FULL FLOW TEST =====\n');

    // 1. Register mentor
    console.log('1. Registering mentor...');
    const mentor = await post('/api/register', {
        name: 'Hemant (Mentor)',
        email: 'hemant.mentor@test.com',
        password: 'password123',
        role: 'mentor'
    });
    console.log('   Result:', mentor.message || mentor.error);
    const mentorToken = mentor.token;

    // 2. Register student
    console.log('2. Registering student...');
    const student = await post('/api/register', {
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
    });
    console.log('   Result:', student.message || student.error);
    const studentToken = student.token;

    // 3. Create a roadmap (mentor)
    console.log('3. Creating roadmap as mentor...');
    const roadmap = await post('/api/roadmaps', {
        title: 'PERN Stack Mastery',
        description: 'A complete roadmap to master the PERN stack',
        is_public: true
    }, mentorToken);
    console.log('   Result:', roadmap.title || roadmap.error);
    const roadmapId = roadmap.id;

    // 4. Student tries to create roadmap (should fail)
    console.log('4. Student trying to create roadmap (should be denied)...');
    const denied = await post('/api/roadmaps', {
        title: 'Unauthorized Roadmap'
    }, studentToken);
    console.log('   Result:', denied.error || 'ERROR: Should have been denied!');

    // 5. Add topics to roadmap (mentor)
    console.log('5. Adding topics to roadmap...');
    const topic1 = await post(`/api/roadmaps/${roadmapId}/topics`, {
        title: 'Node.js Fundamentals',
        description: 'Learn Node.js core concepts',
        order_index: 1
    }, mentorToken);
    console.log('   Topic 1:', topic1.title || topic1.error);

    const topic2 = await post(`/api/roadmaps/${roadmapId}/topics`, {
        title: 'Express.js & REST APIs',
        description: 'Build REST APIs with Express',
        order_index: 2
    }, mentorToken);
    console.log('   Topic 2:', topic2.title || topic2.error);
    const topic1Id = topic1.id;

    // 6. Get roadmap with topics
    console.log('6. Fetching roadmap with topics...');
    const fullRoadmap = await get(`/api/roadmaps/${roadmapId}`);
    console.log('   Roadmap:', fullRoadmap.title, '| Topics:', fullRoadmap.topics?.length);

    // 7. Student enrolls in roadmap
    console.log('7. Student enrolling in roadmap...');
    const enrollment = await post('/api/enrollments', {
        roadmap_id: roadmapId
    }, studentToken);
    console.log('   Result:', enrollment.id ? 'Enrolled successfully' : enrollment.error);

    // 8. Student tries to enroll again (should fail with 409)
    console.log('8. Student enrolling again (should fail)...');
    const duplicate = await post('/api/enrollments', {
        roadmap_id: roadmapId
    }, studentToken);
    console.log('   Result:', duplicate.error || 'ERROR: Should have been rejected!');

    // 9. Student marks topic as complete
    console.log('9. Student marking topic 1 as complete...');
    const progress = await post('/api/progress', {
        topic_id: topic1Id
    }, studentToken);
    console.log('   Result:', progress.id ? 'Topic marked complete' : progress.error);

    // 10. Get all public roadmaps
    console.log('10. Fetching all public roadmaps...');
    const allRoadmaps = await get('/api/roadmaps');
    console.log('    Total public roadmaps:', allRoadmaps.length);

    console.log('\n===== TEST COMPLETE =====\n');
}

runTests().catch(console.error);
