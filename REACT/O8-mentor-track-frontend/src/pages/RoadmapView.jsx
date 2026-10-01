import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RoadmapView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      </div>
    </div>
  );
}