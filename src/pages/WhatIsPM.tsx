import React from 'react';
import { BookOpen, Play, ExternalLink, CheckCircle } from 'lucide-react';

const WhatIsPM: React.FC = () => {
  const resources = [
    {
      type: 'article',
      title: 'What Does a Product Manager Do?',
      description: 'A comprehensive introduction to what Product Managers do and why they matter.',
      link: 'https://www.coursera.org/articles/what-does-a-product-manager-do',
      author: 'Coursera'
    },
    {
      type: 'video',
      title: 'Day in the life of a Product Manager',
      description: 'What I *actually* do as a PM',
      link: 'https://youtu.be/Dnh0jP-GA0o?si=mi0XsjZeUpK819qT',
      author: 'Chloe Shih'
    },
    {
      type: 'article',
      title: 'Product Manager vs Project Manager vs Program Manager: Understanding the Differences',
      description: 'Clear breakdown of different roles and their responsibilities',
      link: 'https://www.linkedin.com/pulse/three-pms-differentiating-between-product-project-diamonde-henderson/',
      author: 'Diamonde Henderson'
    }
  ];

  const responsibilities = [
    'Define product strategy and roadmap',
    'Gather and prioritize customer requirements',
    'Work closely with engineering and design teams',
    'Analyze market trends and competitive landscape',
    'Define success metrics and KPIs',
    'Communicate with stakeholders across the organization'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">What is Product Management?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Product Management is the intersection of business, technology, and user experience. 
            Learn what PMs do and how to get started in this exciting field.
          </p>
        </div>

        {/* What PMs Do Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Does a PM Do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-6">
                Product Managers are the bridge between business strategy, technology, and user needs. 
                They don't manage people directly, but instead manage the product itself.
              </p>
              <p className="text-gray-600">
                Think of PMs as the mini-CEO of the product but without the authority to control over the team. Their roles differ by companies or teams, but in general, they define and ensure the success of a product throughout its lifecycle, from research and development to launch and sales.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities:</h3>
              <ul className="space-y-3">
                {responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Essential PM Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-700 mb-2">Technical</h3>
              <p className="text-gray-600">Basic understanding of technology, data analysis, and software development processes.</p>
            </div>
            <div className="text-center p-6 bg-gold-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gold-700 mb-2">Business</h3>
              <p className="text-gray-600">Strategic thinking, market analysis, and understanding of business metrics and KPIs.</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-2">User-Centric</h3>
              <p className="text-gray-600">User research, design thinking, and understanding customer needs and pain points.</p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Curated Learning Resources</h2>
          <div className="space-y-6">
            {resources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {resource.type === 'video' ? (
                      <Play className="h-6 w-6 text-primary-600" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {resource.author}</span>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <span>Read More</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Want more resources?</p>
            <a
              href="/skillset-hub"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Explore Skillset Hub</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIsPM;