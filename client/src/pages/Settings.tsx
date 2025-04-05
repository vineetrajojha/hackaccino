import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Download,
  History,
  Volume2,
  Moon,
  Sun,
  Globe,
  FileText,
  BarChart,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogOut,
  Mic2,
  Languages,
  Brain,
  LineChart,
  Stethoscope,
  Palette,
  VolumeX,
  Volume1,
  Volume2 as VolumeHigh,
  Headphones,
  MessageSquare,
  Share2,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface HistoryEntry {
  date: string;
  type: 'practice' | 'consultation' | 'achievement' | 'voice' | 'sign';
  title: string;
  description: string;
  improvement?: number;
  duration?: string;
  score?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: JSX.Element;
  progress?: number;
}

interface VoicePreference {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  active: boolean;
}

interface AccessibilityOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: JSX.Element;
}

const historyData: HistoryEntry[] = [
  {
    date: '2024-03-15',
    type: 'practice',
    title: 'Sign Language Practice',
    description: 'Completed 30 minutes of basic sign language training',
    improvement: 15,
    duration: '30 mins',
    score: 85
  },
  {
    date: '2024-03-14',
    type: 'consultation',
    title: 'Voice Therapy Session',
    description: 'Session with Dr. Sarah Wilson - Voice improvement techniques discussed',
    duration: '45 mins'
  },
  {
    date: '2024-03-13',
    type: 'achievement',
    title: 'Weekly Goal Achieved',
    description: 'Completed all weekly practice sessions',
    improvement: 25
  },
  {
    date: '2024-03-12',
    type: 'voice',
    title: 'Voice Training',
    description: 'Pitch control and breathing exercises',
    improvement: 20,
    duration: '25 mins',
    score: 92
  },
  {
    date: '2024-03-11',
    type: 'sign',
    title: 'ASL Basics',
    description: 'Learned 15 new signs for common phrases',
    improvement: 18,
    duration: '40 mins',
    score: 88
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Step',
    description: 'Completed first voice training session',
    date: '2024-03-10',
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    progress: 100
  },
  {
    id: '2',
    title: 'Consistent Learner',
    description: '7 days streak of practice',
    date: '2024-03-15',
    icon: <Calendar className="w-6 h-6 text-indigo-500" />,
    progress: 70
  },
  {
    id: '3',
    title: 'Voice Master',
    description: 'Achieved 90% accuracy in pitch control',
    date: '2024-03-12',
    icon: <Volume2 className="w-6 h-6 text-purple-500" />,
    progress: 90
  },
  {
    id: '4',
    title: 'Sign Language Pioneer',
    description: 'Learned 50 basic signs',
    date: '2024-03-14',
    icon: <Languages className="w-6 h-6 text-blue-500" />,
    progress: 85
  }
];

const voicePreferences: VoicePreference[] = [
  {
    id: 'voice-1',
    name: 'Sarah',
    description: 'Friendly female voice with American accent',
    icon: <Volume2 className="w-6 h-6 text-indigo-600" />,
    active: true
  },
  {
    id: 'voice-2',
    name: 'James',
    description: 'Professional male voice with British accent',
    icon: <Volume1 className="w-6 h-6 text-purple-600" />,
    active: false
  },
  {
    id: 'voice-3',
    name: 'AI Assistant',
    description: 'Clear and natural AI-generated voice',
    icon: <Brain className="w-6 h-6 text-blue-600" />,
    active: false
  }
];

const accessibilityOptions: AccessibilityOption[] = [
  {
    id: 'high-contrast',
    title: 'High Contrast Mode',
    description: 'Enhance visual contrast for better readability',
    enabled: false,
    icon: <Eye className="w-6 h-6" />
  },
  {
    id: 'screen-reader',
    title: 'Screen Reader Support',
    description: 'Enable compatibility with screen readers',
    enabled: true,
    icon: <Headphones className="w-6 h-6" />
  },
  {
    id: 'motion-reduce',
    title: 'Reduced Motion',
    description: 'Minimize animations and transitions',
    enabled: false,
    icon: <RefreshCw className="w-6 h-6" />
  },
  {
    id: 'caption',
    title: 'Auto-Captions',
    description: 'Show captions for all audio content',
    enabled: true,
    icon: <MessageSquare className="w-6 h-6" />
  }
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('voice-1');
  const [voiceVolume, setVoiceVolume] = useState(75);
  const [accessibilitySettings, setAccessibilitySettings] = useState(accessibilityOptions);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    setShowExportModal(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShowExportModal(false);
          setExportProgress(0);
        }, 1000);
      }
    }, 500);
  };

  const handleAccessibilityToggle = (id: string) => {
    setAccessibilitySettings(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (progress: number) => ({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Settings & Preferences
          </h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <nav className="space-y-2">
                {[
                  { id: 'general', icon: SettingsIcon, label: 'General' },
                  { id: 'profile', icon: User, label: 'Profile' },
                  { id: 'notifications', icon: Bell, label: 'Notifications' },
                  { id: 'privacy', icon: Lock, label: 'Privacy' },
                  { id: 'history', icon: History, label: 'History' },
                  { id: 'medical', icon: FileText, label: 'Medical Records' },
                  { id: 'voice', icon: Mic2, label: 'Voice Settings' },
                  { id: 'accessibility', icon: Eye, label: 'Accessibility' },
                  { id: 'help', icon: HelpCircle, label: 'Help & Support' }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={tabVariants}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                    
                    {/* Theme Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme('light')}
                          className={`flex-1 p-4 rounded-xl border ${
                            theme === 'light'
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <Sun className="w-6 h-6 mx-auto mb-2" />
                          <span>Light</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme('dark')}
                          className={`flex-1 p-4 rounded-xl border ${
                            theme === 'dark'
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <Moon className="w-6 h-6 mx-auto mb-2" />
                          <span>Dark</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Language</h3>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                        <option value="korean">Korean</option>
                        <option value="arabic">Arabic</option>
                      </select>
                    </div>

                    {/* Color Theme */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Color Theme</h3>
                      <div className="grid grid-cols-4 gap-4">
                        {['indigo', 'purple', 'blue', 'green'].map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full h-12 rounded-lg bg-${color}-500`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Settings</h2>
                    
                    {/* Voice Selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">AI Voice Assistant</h3>
                      <div className="space-y-3">
                        {voicePreferences.map((voice) => (
                          <motion.div
                            key={voice.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-xl border ${
                              selectedVoice === voice.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200'
                            } cursor-pointer`}
                            onClick={() => setSelectedVoice(voice.id)}
                          >
                            <div className="flex items-center gap-3">
                              {voice.icon}
                              <div>
                                <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                                <p className="text-sm text-gray-600">{voice.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Voice Volume */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Voice Volume</h3>
                      <div className="flex items-center gap-4">
                        <VolumeX className="w-6 h-6 text-gray-400" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={voiceVolume}
                          onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <VolumeHigh className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-sm text-gray-600 text-center">{voiceVolume}%</p>
                    </div>
                  </div>
                )}

                {activeTab === 'accessibility' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Settings</h2>
                    
                    <div className="space-y-4">
                      {accessibilitySettings.map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {option.icon}
                              <div>
                                <h3 className="font-semibold text-gray-900">{option.title}</h3>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={option.enabled}
                                onChange={() => handleAccessibilityToggle(option.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
                    
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-blue-50 rounded-xl"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Learn how to use all features of VocalEdge AI
                        </p>
                        <button className="text-blue-600 font-medium flex items-center gap-2">
                          View Documentation
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-purple-50 rounded-xl"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Watch step-by-step guides for better understanding
                        </p>
                        <button className="text-purple-600 font-medium flex items-center gap-2">
                          Watch Tutorials
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-green-50 rounded-xl"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Get help from our support team
                        </p>
                        <button className="text-green-600 font-medium flex items-center gap-2">
                          Contact Us
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-indigo-600" />
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                        Change Photo
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-indigo-600" />
                          <span>Practice Reminders</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications}
                            onChange={() => setNotifications(!notifications)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                          <span>Appointment Reminders</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-indigo-600" />
                          <span>Chat Notifications</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Share2 className="w-5 h-5 text-indigo-600" />
                          <span>Progress Updates</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity History</h2>
                    <div className="space-y-4">
                      {historyData.map((entry, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                              <p className="text-sm text-gray-600">{entry.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <p className="text-xs text-gray-500">{entry.date}</p>
                                {entry.duration && (
                                  <p className="text-xs text-gray-500">Duration: {entry.duration}</p>
                                )}
                                {entry.score && (
                                  <p className="text-xs text-green-600">Score: {entry.score}%</p>
                                )}
                              </div>
                            </div>
                            {entry.improvement && (
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                +{entry.improvement}% Improvement
                              </div>
                            )}
                          </div>
                          {entry.score && (
                            <div className="mt-3">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial="hidden"
                                  animate="visible"
                                  variants={progressBarVariants}
                                  custom={entry.score}
                                  className="h-full bg-green-500"
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'medical' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Latest Diagnosis</h3>
                        <p className="text-sm text-gray-600">Mild vocal cord strain</p>
                        <p className="text-xs text-gray-500 mt-1">Updated: March 15, 2024</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
                        <p className="text-sm text-gray-600">Voice therapy - 8 weeks program</p>
                        <p className="text-xs text-gray-500 mt-1">Next Review: April 1, 2024</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Medications</h3>
                        <p className="text-sm text-gray-600">No current medications</p>
                        <p className="text-xs text-gray-500 mt-1">Last Updated: March 10, 2024</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                        <p className="text-sm text-gray-600">None reported</p>
                        <p className="text-xs text-gray-500 mt-1">Verified: March 1, 2024</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Progress & Achievements</h3>
                      <div className="space-y-4">
                        {achievements.map((achievement) => (
                          <motion.div
                            key={achievement.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-lg">
                                {achievement.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                                {achievement.progress && (
                                  <div className="mt-2">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={progressBarVariants}
                                        custom={achievement.progress}
                                        className="h-full bg-indigo-500"
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Progress: {achievement.progress}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-900">Data Sharing</h3>
                          <p className="text-sm text-gray-600">Share progress with medical team</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-900">Profile Visibility</h3>
                          <p className="text-sm text-gray-600">Make profile visible to others</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-900">Analytics Collection</h3>
                          <p className="text-sm text-gray-600">Allow anonymous usage data collection</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Export Data Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Exporting Data</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                  />
                </div>
                <div className="text-center text-sm text-gray-600">
                  {exportProgress}% Complete
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle account deletion
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;