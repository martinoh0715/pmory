import React from 'react';
import { Target, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">PMory</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering Emory students to excel in Product Management through curated resources, 
              mentorship, and career guidance.
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail className="h-4 w-4" />
              <span>martinoh0715@gmail.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/what-is-pm" className="text-gray-300 hover:text-white transition-colors">What is PM</a></li>
              <li><a href="/skillset-hub" className="text-gray-300 hover:text-white transition-colors">Skillset Hub</a></li>
              <li><a href="/mentorship" className="text-gray-300 hover:text-white transition-colors">Mentorship</a></li>
              <li><a href="/job-alert" className="text-gray-300 hover:text-white transition-colors">Job Alerts</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://emory.edu" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                  <span>Emory University</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://career.emory.edu" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1">
                  <span>Career Center</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PMory.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;