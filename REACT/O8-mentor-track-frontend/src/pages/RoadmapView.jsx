import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RoadmapView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const [newTopic, setNewTopic] = useState({ title: '', description: '' });

 const handleAddTopic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5003/api/roadmaps/${id}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTopic.title,
          description: newTopic.description,
          order_index: roadmap.topics ? roadmap.topics.length + 1 : 1
        })
      });
      if (!response.ok) throw new Error('Failed to add topic');
      // Clear the form
      setNewTopic({ title: '', description: '' });
      
      // Refresh the page data by calling the same URL again
      // A quick hack for now is just reloading the window, or we can fetch again.
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

    const handleMarkComplete = async (topicId) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5003/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic_id: topicId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark complete');
      }

      alert("Topic marked as complete!");
      // Refresh to show updated UI
      window.location.reload(); 
      
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };


   const handleChange = (e) => {
    setNewTopic({ ...newTopic, [e.target.name]: e.target.value });
  };

  // Fetch the roadmap and its topics
  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5003/api/roadmaps/${id}`);
        
        if (!response.ok) {
          throw new Error('Roadmap not found');
        }

        const data = await response.json();
        setRoadmap(data); // data contains the roadmap info AND an array of topics
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapDetails();
  }, [id]); // This effect runs whenever the ID in the URL changes

  if (loading) return <div className="p-10 text-center">Loading roadmap details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Dashboard
        </button>

        {/* Roadmap Header */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{roadmap.title}</h1>
          <p className="text-gray-600 text-lg">{roadmap.description}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            Created by {roadmap.mentor_name}
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Curriculum Topics</h2>
          </div>
          
          <div className="p-6">
            {roadmap.topics && roadmap.topics.length > 0 ? (
              <div className="space-y-4">
                {roadmap.topics.map((topic, index) => (
                  <div key={topic.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                      <p className="text-gray-600 mt-1">{topic.description}</p>
                    
                      {user?.role === 'student' && (
                        <button 
                          onClick={() => handleMarkComplete(topic.id)}
                          className="mt-3 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded font-medium border border-green-200 transition-colors"
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No topics have been added to this roadmap yet.
              </div>
            )}
          </div>
        </div>

                {/* Add Topic Form (Only visible to the Mentor who created this roadmap) */}
        {user?.role === 'mentor' && user?.name === roadmap.mentor_name && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Topic</h3>
            <form onSubmit={handleAddTopic} className="flex flex-col gap-4">
              <input 
                type="text" 
                name="title" 
                value={newTopic.title} 
                onChange={handleChange} 
                placeholder="Topic Title (e.g. JWT Authentication)"
                className="border border-gray-300 p-2 rounded-lg"
                required
              />
              <textarea 
                name="description" 
                value={newTopic.description} 
                onChange={handleChange} 
                placeholder="What will they learn?"
                className="border border-gray-300 p-2 rounded-lg"
                required
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium">
                Add Topic
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}