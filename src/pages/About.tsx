import React from 'react';
import { Target, Heart, Users, Lightbulb } from 'lucide-react';
import MartinImage from 'project/src/assets/martin.png';

const About: React.FC = () => {
  const teamMember = {
    name: 'Martin Oh',
    role: 'Founder & Developer',
    year: 'Class of 2026',
    bio: 'Busniness Administration Major with Information System & Operation Management, Marketing Concentration',
    image: MartinImage,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Target className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About PMory</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PMory was created by Emory students, for Emory students. We saw the need for a centralized 
            hub to make product management more accessible and help our peers break into this exciting field.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <Heart className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto leading-relaxed">
            To democratize access to product management education and career opportunities for Emory students, 
            providing the resources, connections, and guidance needed to launch successful PM careers.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community First</h3>
            <p className="text-gray-600">Built by students, for students. We understand the unique challenges of breaking into PM from a college perspective.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Lightbulb className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Content</h3>
            <p className="text-gray-600">Every resource is carefully curated and tested by our team to ensure it provides real value to aspiring PMs.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Target className="h-8 w-8 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Results Focused</h3>
            <p className="text-gray-600">We measure success by the PM roles our community members land and the skills they develop.</p>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Meet the Team</h2>
          <div className="flex justify-center">
            <div className="text-center max-w-sm">
              <img
                src={teamMember.image}
                alt={teamMember.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-1">{teamMember.name}</h3>
              <p className="text-primary-600 font-medium mb-1">{teamMember.role}</p>
              <p className="text-gray-500 text-sm mb-3">{teamMember.year}</p>
              <p className="text-gray-600">{teamMember.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
