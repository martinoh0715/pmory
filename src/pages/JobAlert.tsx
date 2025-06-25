import React, { useState, useEffect } from 'react';
import { Bell, Calendar, MapPin, Building, ExternalLink, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import jobsData from '../data/jobs.json';
import settingsData from '../config/settings.json';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  deadline: string;
  posted: string;
  status: string;
  description: string;
  requirements: string[];
  applicationLink: string;
}

const JobAlert: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Load jobs from JSON file
    setJobs(jobsData);
    
    // Check if user is already subscribed
    const subscribers = JSON.parse(localStorage.getItem('pmory_subscribers') || '[]');
    const userEmail = localStorage.getItem('user_email');
    if (userEmail && subscribers.includes(userEmail)) {
      setEmail(userEmail);
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Load settings from config
      const settings = JSON.parse(localStorage.getItem('pmory_settings') || JSON.stringify(settingsData));
      
      const templateParams = {
        to_email: email,
        from_name: 'PMory Team',
        subject: 'Welcome to PMory Job Alerts!',
        message: `Thank you for subscribing to PMory job alerts! 

You'll now receive weekly updates about:
• New APM and RPM program openings
• Entry-level PM positions
• Application deadlines and tips
• Exclusive opportunities for Emory students

We're excited to help you on your PM journey!

Best regards,
The PMory Team

---
To unsubscribe, simply reply to any of our emails with "UNSUBSCRIBE" in the subject line.`
      };

      await emailjs.send(
        settings.emailjs.serviceId,
        settings.emailjs.templateIds.welcomeJobAlert,
        templateParams,
        settings.emailjs.publicKey
      );

      setSubscribed(true);
      
      // Store subscription in localStorage for persistence
      const subscribers = JSON.parse(localStorage.getItem('pmory_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('pmory_subscribers', JSON.stringify(subscribers));
        localStorage.setItem('user_email', email);
      }

      // Log new subscriber for admin (since we can't send email notification)
      console.log(`New subscriber: ${email} at ${new Date().toISOString()}`);

    } catch (error) {
      console.error('Failed to subscribe:', error);
      setError('Failed to subscribe. Please check your EmailJS configuration or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysLeft < 0) return { status: 'expired', text: 'Expired', color: 'bg-red-100 text-red-700' };
    if (daysLeft <= 7) return { status: 'urgent', text: `${daysLeft} days left`, color: 'bg-orange-100 text-orange-700' };
    return { status: 'active', text: `${daysLeft} days left`, color: 'bg-green-100 text-green-700' };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'closing soon':
        return 'bg-orange-100 text-orange-700';
      case 'closed':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Bell className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Alert Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest APM, RPM, and entry-level PM opportunities. 
            Never miss application deadlines for your dream product management roles.
          </p>
        </div>

        {/* Subscription Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 mb-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Get Job Alerts Delivered</h2>
            <p className="text-blue-100 mb-6">
              Subscribe to receive weekly updates about new PM job openings and upcoming deadlines.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="flex items-center justify-center space-x-2 text-red-200 bg-red-500/20 px-4 py-2 rounded-lg max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span>Successfully subscribed!</span>
                </div>
                <p className="text-blue-100">You'll receive weekly job alerts at <strong>{email}</strong></p>
                <p className="text-blue-200 text-sm mt-2">Check your email for a confirmation message!</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Current Opportunities</h2>
            <div className="text-sm text-gray-600">
              Updated daily • {jobs.length} active positions
            </div>
          </div>

          {jobs.map((job) => {
            const deadlineInfo = getDeadlineStatus(job.deadline);
            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                            {job.type}
                          </span>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${deadlineInfo.color}`}>
                        {deadlineInfo.text}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{job.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-gray-600 flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted: {new Date(job.posted).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col space-y-3">
                    <a
                      href={job.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors text-center flex items-center justify-center space-x-2 ${
                        job.status.toLowerCase() === 'closed' 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      <span>{job.status.toLowerCase() === 'closed' ? 'Closed' : 'Apply Now'}</span>
                      {job.status.toLowerCase() !== 'closed' && <ExternalLink className="h-4 w-4" />}
                    </a>
                    <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Application Tips */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Success Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-primary-50 rounded-xl">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Resume & Cover Letter</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Highlight measurable impact</li>
                <li>• Show customer obsession</li>
                <li>• Demonstrate analytical thinking</li>
                <li>• Include leadership examples</li>
              </ul>
            </div>
            <div className="p-6 bg-gold-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gold-700 mb-3">Case Study Prep</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Practice structured thinking</li>
                <li>• Use frameworks (CIRCLES, HEART)</li>
                <li>• Focus on user needs</li>
                <li>• Quantify your solutions</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Interview Prep</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Know the company's products</li>
                <li>• Prepare STAR method stories</li>
                <li>• Practice product critiques</li>
                <li>• Ask thoughtful questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlert;