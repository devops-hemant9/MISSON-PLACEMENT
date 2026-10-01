import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user.role=='mentor'?'mentor':"student";

  const navigate = useNavigate();
  const [newRoadmap , setNewRoadmap] = useState({title: '' , description: ''});

  const [roadmaps, setRoadmaps] = useState([]);

  const fetchRoadmaps = async () => {
    try {
      // The GET route doesn't strictly need a token because it's public, 
      // but it's good practice.
      const response = await fetch('http://localhost:5003/api/roadmaps');
      const data = await response.json();
      setRoadmaps(data);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
    }
  };

  useEffect(() => {
  fetchRoadmaps();
}, []);

  const logout = ()=>{
    localStorage.clear() ;
    navigate('/');
  }

  const handleEnroll = async (roadmapId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:5003/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roadmap_id: roadmapId })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error); // Will alert "Already enrolled in this roadmap" if they try twice
      return;
    }

    alert("Successfully enrolled!");
    
  } catch (err) {
    console.error(err);
  }
};

 const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    
    // Get the token because this is a protected backend route
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5003/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // This is how the backend knows who you are
        },
        body: JSON.stringify({
          title: newRoadmap.title,
          description: newRoadmap.description, // Using your spelling
          is_public: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create roadmap');
      }

      const data = await response.json();
      console.log("Success! Backend returned:", data);
      
      // Clear the form after success
      setNewRoadmap({ title: '', discription: '' });

       fetchRoadmaps(); 
      
    } catch (err) {
      console.error(err.message);
    }
};

  const handleChange = (e) => {
    setNewRoadmap({ ...newRoadmap, [e.target.name]: e.target.value });
  };

    return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MentorTrack</h1>
          <p className="text-gray-500">
            Welcome back, <span className="font-semibold text-blue-600">{user.name}</span> ({role})
          </p>
        </div>
        <button 
          onClick={logout} 
          className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Mentor Form Column (Only visible to mentors) */}
        {role === "mentor" && (
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create Roadmap</h2>
            <form onSubmit={handleCreateRoadmap} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newRoadmap.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Mastery"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="discription" 
                  value={newRoadmap.discription}
                  onChange={handleChange}
                  placeholder="What will students learn?"
                  rows="3"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition-colors">
                Publish Roadmap
              </button>
            </form>
          </div>
        )}

        {/* Roadmaps List Column (Visible to everyone, wider for students) */}
        <div className={role === "mentor" ? "md:col-span-2" : "md:col-span-3 max-w-4xl mx-auto w-full"}>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Available Roadmaps</h2>
          
          {roadmaps.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              No roadmaps available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roadmaps.map((v) => (
                <div key={v.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <h3 
                    onClick={() => navigate(`/roadmap/${v.id}`)}
                    className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{v.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                    <span>By {v.mentor_name || 'Mentor'}</span>
                    
                    {/* Placeholder for Enrollment - We will build this tomorrow */}
                    {role === "student" && (
                      <button 
                        onClick={() => handleEnroll(v.id)} 
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        Enroll →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}