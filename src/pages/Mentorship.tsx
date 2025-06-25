import React, { useState, useEffect } from 'react';
import { Users, MapPin, Briefcase, GraduationCap, Mail } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import mentorsData from '../data/mentors.json';

interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  gradYear?: string;
  expertise: string[];
  image: string;
  type: string;
  email: string;
  bio?: string;
  linkedIn?: string;
  availability?: string;
}

const Mentorship: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    // Load mentors from localStorage first (admin changes), then fallback to JSON
    const adminMentors = localStorage.getItem('pmory_mentors');
    if (adminMentors) {
      try {
        const parsedMentors = JSON.parse(adminMentors);
        if (Array.isArray(parsedMentors) && parsedMentors.length > 0) {
          setMentors(parsedMentors);
        } else {
          setMentors(mentorsData);
        }
      } catch (error) {
        console.error('Error parsing admin mentors:', error);
        setMentors(mentorsData);
      }
    } else {
      setMentors(mentorsData);
    }
  }, []);

  const filteredMentors = selectedFilter === 'all' 
    ? mentors 
    : mentors.filter(mentor => mentor.type === selectedFilter);

  const handleConnectClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with Emory PM alumni, current student PMs, and supportive faculty. 
            Build meaningful relationships that will accelerate your product management journey.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {[
            { key: 'all', label: 'All Mentors' },
            { key: 'alumni', label: 'Alumni' },
            { key: 'student', label: 'Students' },
            { key: 'professor', label: 'Faculty' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-primary-600 font-medium">{mentor.role}</p>
                  <p className="text-gray-600">{mentor.company}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{mentor.location}</span>
                  </div>
                  {mentor.gradYear && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm">Class of {mentor.gradYear}</span>
                    </div>
                  )}
                </div>

                {mentor.bio && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{mentor.bio}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {mentor.availability && (
                  <div className="mb-4">
                    <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full text-center">
                      {mentor.availability}
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => handleConnectClick(mentor)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Connect</span>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No mentors found</h3>
              <p className="text-gray-500">
                {selectedFilter === 'all' 
                  ? 'No mentors are currently available.' 
                  : `No ${selectedFilter} mentors are currently available.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Networking Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Before Reaching Out:</h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Research their background and current role</li>
                <li>• Read their recent articles or posts</li>
                <li>• Prepare specific questions</li>
                <li>• Keep initial ask small (15-20 minutes)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">During the Conversation:</h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Be respectful of their time</li>
                <li>• Ask thoughtful, specific questions</li>
                <li>• Take notes and show genuine interest</li>
                <li>• Ask for introductions if appropriate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {selectedMentor && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            mentorName={selectedMentor.name}
            mentorEmail={selectedMentor.email}
          />
        )}
      </div>
    </div>
  );
};

export default Mentorship;
