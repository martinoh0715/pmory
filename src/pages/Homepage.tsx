import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, BrainCircuit, Bell, Target, Star } from 'lucide-react';

const Homepage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: "What is Product Management?",
      description: "Start your PM journey with curated articles, videos, and beginner-friendly guides that explain what product managers do and why they're essential to tech companies.",
      link: "/what-is-pm",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: BrainCircuit,
      title: "Skillset Hub",
      description: "Master essential PM tools like Figma, Notion, SQL, and roadmapping platforms through step-by-step tutorials designed specifically for beginners.",
      link: "/skillset-hub",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Users,
      title: "AI Mentor",
      description: "Get instant answers with our AI chatbot—designed to help students navigate Emory’s Product Management landscape.",
      link: "/mentorship",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      icon: Bell,
      title: "Job Alert Center",
      description: "Stay updated with the latest APM and RPM opportunities. Get notified about application deadlines and never miss out on your dream PM role.",
      link: "/job-alert",
      image: "https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Target className="h-16 w-16 text-gold-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-gold-400">PMory</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your centralized digital hub for Product Management excellence at Emory. 
              Discover curated resources, build essential skills, and accelerate your PM career journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/what-is-pm"
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/job-alert"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <div key={feature.title} className={`mb-20 ${index === features.length - 1 ? 'mb-0' : ''}`}>
              <div className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-1">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <feature.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Launch Your PM Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of Emory students who are already building their product management skills and networks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/skillset-hub"
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Start Building Skills
            </Link>
            <Link
              to="/mentorship"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Find a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
