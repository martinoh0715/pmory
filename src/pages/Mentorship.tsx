import React from 'react';
import { UserRoundSearch } from 'lucide-react';

const Mentorship: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <UserRoundSearch className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentorship</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get guidance, ask questions, and explore insights with the PMory AI Chatbot. 
            Whether you're new to Product Management or preparing for interviews, PMory is here to help.
          </p>
        </div>

        {/* Chatbot Embed */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src="https://moonlit-lolly-9ab72d.netlify.app"
            width="100%"
            height="700px"
            style={{ border: 'none' }}
            title="PMory Chatbot"
          />
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
