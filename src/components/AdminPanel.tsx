import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Save, Plus, Trash2, Edit3, Calendar, Building, Lock, Copy, Download } from 'lucide-react';
import mentorsData from '../data/mentors.json';
import jobsData from '../data/jobs.json';
import settingsData from '../config/settings.json';
import emailjs from '@emailjs/browser';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('mentors');
  const [mentors, setMentors] = useState(mentorsData);
  const [jobs, setJobs] = useState<Job[]>(jobsData);
  const [settings, setSettings] = useState(settingsData);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [showEmails, setShowEmails] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);
  const [jsonExportType, setJsonExportType] = useState<'mentors' | 'jobs' | 'settings'>('mentors');

  // Admin password - In production, this should be environment variable or backend auth
  const ADMIN_PASSWORD = 'dh960122!';

  useEffect(() => {
    // Load subscribers from localStorage
    const savedSubscribers = JSON.parse(localStorage.getItem('pmory_subscribers') || '[]');
    setSubscribers(savedSubscribers);
    
    // Load admin data from localStorage if it exists
    const adminMentors = localStorage.getItem('pmory_mentors');
    const adminJobs = localStorage.getItem('pmory_jobs');
    const adminSettings = localStorage.getItem('pmory_settings');
    
    if (adminMentors) {
      try {
        setMentors(JSON.parse(adminMentors));
      } catch (error) {
        console.error('Error loading admin mentors:', error);
      }
    }
    
    if (adminJobs) {
      try {
        setJobs(JSON.parse(adminJobs));
      } catch (error) {
        console.error('Error loading admin jobs:', error);
      }
    }
    
    if (adminSettings) {
      try {
        setSettings(JSON.parse(adminSettings));
      } catch (error) {
        console.error('Error loading admin settings:', error);
      }
    }
    
    // Check if already authenticated in this session
    const isSessionAuth = sessionStorage.getItem('pmory_admin_auth') === 'true';
    setIsAuthenticated(isSessionAuth);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pmory_mentors', JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem('pmory_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('pmory_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      setPassword('');
      // Store authentication in session storage (expires when browser closes)
      sessionStorage.setItem('pmory_admin_auth', 'true');
    } else {
      setAuthError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pmory_admin_auth');
    onClose();
  };

  const handleSaveSettings = () => {
    // Settings are automatically saved via useEffect
    alert('Settings saved successfully!');
  };

  const handleAddMentor = () => {
    const newMentor = {
      id: Math.max(...mentors.map(m => m.id)) + 1,
      name: '',
      role: '',
      company: '',
      location: '',
      gradYear: '',
      expertise: [],
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'alumni',
      email: '',
      bio: '',
      linkedIn: '',
      availability: ''
    };
    setMentors([...mentors, newMentor]);
  };

  const handleUpdateMentor = (id: number, field: string, value: any) => {
    setMentors(mentors.map(mentor => 
      mentor.id === id ? { ...mentor, [field]: value } : mentor
    ));
  };

  const handleDeleteMentor = (id: number) => {
    if (confirm('Are you sure you want to delete this mentor?')) {
      setMentors(mentors.filter(mentor => mentor.id !== id));
    }
  };

  const handleAddJob = () => {
    const newJob: Job = {
      id: Math.max(...jobs.map(j => j.id)) + 1,
      title: '',
      company: '',
      location: '',
      type: 'Entry Level',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      posted: new Date().toISOString().split('T')[0],
      status: 'Open',
      description: '',
      requirements: [''],
      applicationLink: ''
    };
    setEditingJob(newJob);
    setIsAddingJob(true);
  };

  const handleSaveJob = () => {
    if (!editingJob) return;
    
    if (isAddingJob) {
      setJobs([...jobs, editingJob]);
      setIsAddingJob(false);
    } else {
      setJobs(jobs.map(job => job.id === editingJob.id ? editingJob : job));
    }
    
    setEditingJob(null);
    
    // Notify subscribers about new job or status change
    if (subscribers.length > 0) {
      notifySubscribers(editingJob, isAddingJob ? 'new' : 'updated');
    }
  };

  const handleDeleteJob = (id: number) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  const handleJobStatusUpdate = (id: number, status: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, status } : job
    );
    setJobs(updatedJobs);
    
    // Notify subscribers about status change
    const updatedJob = updatedJobs.find(job => job.id === id);
    if (subscribers.length > 0 && updatedJob) {
      notifySubscribers(updatedJob, 'status_change');
    }
  };

  const notifySubscribers = async (job: Job, type: 'new' | 'updated' | 'status_change') => {
    try {
      const settings = JSON.parse(localStorage.getItem('pmory_settings') || JSON.stringify(settingsData));
      
      let subject = '';
      let message = '';
      
      switch (type) {
        case 'new':
          subject = `🚨 New PM Job Alert: ${job.title} at ${job.company}`;
          message = `A new Product Manager position has been posted!\n\n${job.title} at ${job.company}\nLocation: ${job.location}\nDeadline: ${new Date(job.deadline).toLocaleDateString()}\n\n${job.description}\n\nApply now: ${job.applicationLink}`;
          break;
        case 'status_change':
          subject = `📢 Job Status Update: ${job.title} at ${job.company}`;
          message = `The status for ${job.title} at ${job.company} has been updated to: ${job.status}\n\nDeadline: ${new Date(job.deadline).toLocaleDateString()}\n\nApply now: ${job.applicationLink}`;
          break;
        case 'updated':
          subject = `📝 Job Updated: ${job.title} at ${job.company}`;
          message = `The job posting for ${job.title} at ${job.company} has been updated.\n\nCheck out the latest details and apply: ${job.applicationLink}`;
          break;
      }

      // Send to all subscribers
      for (const email of subscribers) {
        await emailjs.send(
          settings.emailjs.serviceId,
          settings.emailjs.templateIds.jobAlert,
          {
            to_email: email,
            subject: subject,
            message: message,
            job_title: job.title,
            company: job.company
          },
          settings.emailjs.publicKey
        );
      }
      
      console.log(`Notified ${subscribers.length} subscribers about ${type} for job: ${job.title}`);
    } catch (error) {
      console.error('Failed to notify subscribers:', error);
    }
  };

  const exportData = () => {
    const data = {
      mentors,
      jobs,
      settings,
      subscribers,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmory-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const copyJsonToClipboard = (data: any) => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSON copied to clipboard! You can now paste this into your GitHub file.');
    });
  };

  const getJsonForExport = () => {
    switch (jsonExportType) {
      case 'mentors':
        return mentors;
      case 'jobs':
        return jobs;
      case 'settings':
        return settings;
      default:
        return mentors;
    }
  };

  const getGitHubFilePath = () => {
    switch (jsonExportType) {
      case 'mentors':
        return 'src/data/mentors.json';
      case 'jobs':
        return 'src/data/jobs.json';
      case 'settings':
        return 'src/config/settings.json';
      default:
        return 'src/data/mentors.json';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            {isAuthenticated && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Authenticated
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Authentication Form */}
        {!isAuthenticated ? (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Lock className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h3>
              <p className="text-gray-600 mb-6">
                Please enter the admin password to access the management panel.
              </p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Login to Admin Panel
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Security Note:</strong> This is a basic password protection. 
                  For production use, implement proper authentication with user accounts, 
                  JWT tokens, and backend validation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'mentors', label: 'Mentors' },
                { id: 'jobs', label: 'Jobs' },
                { id: 'links', label: 'External Links' },
                { id: 'subscribers', label: 'Subscribers' },
                { id: 'export', label: 'Export to GitHub' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'mentors' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Manage Mentors</h3>
                    <button
                      onClick={handleAddMentor}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Mentor</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {mentors.map(mentor => (
                      <div key={mentor.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Name"
                            value={mentor.name}
                            onChange={(e) => handleUpdateMentor(mentor.id, 'name', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            value={mentor.role}
                            onChange={(e) => handleUpdateMentor(mentor.id, 'role', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                          <input
                            type="text"
                            placeholder="Company"
                            value={mentor.company}
                            onChange={(e) => handleUpdateMentor(mentor.id, 'company', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                          <input
                            type="email"
                            placeholder="Email (hidden from users)"
                            value={mentor.email}
                            onChange={(e) => handleUpdateMentor(mentor.id, 'email', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                          <select
                            value={mentor.type}
                            onChange={(e) => handleUpdateMentor(mentor.id, 'type', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2"
                          >
                            <option value="alumni">Alumni</option>
                            <option value="student">Student</option>
                            <option value="professor">Professor</option>
                          </select>
                          <button
                            onClick={() => handleDeleteMentor(mentor.id)}
                            className="flex items-center justify-center space-x-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Job Management</h3>
                    <button
                      onClick={handleAddJob}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Job</span>
                    </button>
                  </div>

                  {/* Job List */}
                  <div className="space-y-4 mb-6">
                    {jobs.map(job => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="font-semibold text-gray-900">{job.title}</h4>
                              <span className="text-gray-600">at {job.company}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                job.status === 'Open' ? 'bg-green-100 text-green-700' :
                                job.status === 'Closing Soon' ? 'bg-orange-100 text-orange-700' :
                                job.status === 'Closed' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.type}</span>
                              <span>•</span>
                              <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={job.status}
                              onChange={(e) => handleJobStatusUpdate(job.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="Open">Open</option>
                              <option value="Closing Soon">Closing Soon</option>
                              <option value="Closed">Closed</option>
                              <option value="Paused">Paused</option>
                            </select>
                            <button
                              onClick={() => setEditingJob(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Job Editor Modal */}
                  {editingJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900">
                            {isAddingJob ? 'Add New Job' : 'Edit Job'}
                          </h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Job Title"
                              value={editingJob.title}
                              onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={editingJob.company}
                              onChange={(e) => setEditingJob({...editingJob, company: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={editingJob.location}
                              onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <select
                              value={editingJob.type}
                              onChange={(e) => setEditingJob({...editingJob, type: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            >
                              <option value="APM Program">APM Program</option>
                              <option value="RPM Program">RPM Program</option>
                              <option value="Entry Level">Entry Level</option>
                              <option value="Internship">Internship</option>
                            </select>
                            <input
                              type="date"
                              value={editingJob.deadline}
                              onChange={(e) => setEditingJob({...editingJob, deadline: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <select
                              value={editingJob.status}
                              onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                              className="border border-gray-300 rounded px-3 py-2"
                            >
                              <option value="Open">Open</option>
                              <option value="Closing Soon">Closing Soon</option>
                              <option value="Closed">Closed</option>
                              <option value="Paused">Paused</option>
                            </select>
                          </div>
                          <textarea
                            placeholder="Job Description"
                            value={editingJob.description}
                            onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                          <input
                            type="url"
                            placeholder="Application Link"
                            value={editingJob.applicationLink}
                            onChange={(e) => setEditingJob({...editingJob, applicationLink: e.target.value})}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Requirements (one per line)
                            </label>
                            <textarea
                              value={editingJob.requirements.join('\n')}
                              onChange={(e) => setEditingJob({
                                ...editingJob, 
                                requirements: e.target.value.split('\n').filter(req => req.trim())
                              })}
                              rows={4}
                              className="w-full border border-gray-300 rounded px-3 py-2"
                              placeholder="Bachelor's degree&#10;Strong analytical skills&#10;Leadership experience"
                            />
                          </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setEditingJob(null);
                              setIsAddingJob(false);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveJob}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            {isAddingJob ? 'Add Job' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'links' && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">External Links Management</h3>
                  <div className="space-y-4">
                    {Object.entries(settings.externalLinks).map(([key, url]) => (
                      <div key={key} className="flex items-center space-x-4">
                        <label className="w-32 text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setSettings({
                            ...settings,
                            externalLinks: {
                              ...settings.externalLinks,
                              [key]: e.target.value
                            }
                          })}
                          className="flex-1 border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Links</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'subscribers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Email Subscribers ({subscribers.length})</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowEmails(!showEmails)}
                        className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                      >
                        {showEmails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showEmails ? 'Hide' : 'Show'} Emails</span>
                      </button>
                      <button
                        onClick={exportData}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Save className="h-4 w-4" />
                        <span>Export Data</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    {subscribers.length === 0 ? (
                      <p className="text-gray-600">No subscribers yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {subscribers.map((email, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                            <span className="font-mono">
                              {showEmails ? email : email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                            </span>
                            <span className="text-sm text-gray-500">#{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">Export to GitHub</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important: Deploy Changes</h4>
                    <p className="text-yellow-700 text-sm">
                      Changes made in the Admin Panel only affect your local browser. To update the live website, 
                      you need to copy the JSON code below and paste it into the corresponding GitHub file.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select data to export:
                      </label>
                      <select
                        value={jsonExportType}
                        onChange={(e) => setJsonExportType(e.target.value as 'mentors' | 'jobs' | 'settings')}
                        className="border border-gray-300 rounded px-3 py-2 mb-4"
                      >
                        <option value="mentors">Mentors Data</option>
                        <option value="jobs">Jobs Data</option>
                        <option value="settings">Settings Data</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          GitHub File: <code className="text-sm bg-gray-200 px-2 py-1 rounded">{getGitHubFilePath()}</code>
                        </h4>
                        <button
                          onClick={() => copyJsonToClipboard(getJsonForExport())}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy JSON</span>
                        </button>
                      </div>
                      <pre className="bg-white border rounded p-3 text-xs overflow-auto max-h-64">
                        {JSON.stringify(getJsonForExport(), null, 2)}
                      </pre>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">How to Update GitHub:</h4>
                      <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                        <li>Click "Copy JSON" above</li>
                        <li>Go to your GitHub repository</li>
                        <li>Navigate to <code className="bg-blue-100 px-1 rounded">{getGitHubFilePath()}</code></li>
                        <li>Click the edit button (pencil icon)</li>
                        <li>Replace all content with the copied JSON</li>
                        <li>Commit the changes</li>
                        <li>Your website will automatically update in 1-2 minutes!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">Security Status:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🔒 <strong>Basic Password Protection:</strong> Admin panel now requires password authentication</p>
                <p>⏱️ <strong>Session-Based:</strong> Authentication expires when browser closes</p>
                <p>⚠️ <strong>Production Note:</strong> Implement proper user authentication, JWT tokens, and backend validation</p>
                <p>📧 <strong>Current Password:</strong> <code className="bg-gray-200 px-1 rounded">pmory2025admin</code></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
