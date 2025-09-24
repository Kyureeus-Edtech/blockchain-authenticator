import React, { useState, useEffect } from 'react';
import { Lock, Shield, Hash, Key, User, Eye, EyeOff, CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState({ success: false, message: '', type: '' });
  const [blockchainData, setBlockchainData] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(0);

  // Mock blockchain data structure
  const mockBlockchain = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'User Login',
      user: 'alice',
      hash: 'a1b2c3d4e5f67890abcdef1234567890',
      signature: 'sig_abc123def456'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      action: 'Data Access',
      user: 'alice',
      hash: 'f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5',
      signature: 'sig_def456ghi789'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      action: 'Permission Update',
      user: 'bob',
      hash: '1234567890abcdef1234567890abcdef',
      signature: 'sig_ghi789jkl012'
    }
  ];

  useEffect(() => {
    setBlockchainData(mockBlockchain);
  }, []);

  const generateHash = (data) => {
    // Simple hash simulation - in real app this would use crypto libraries
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setAuthStatus({ success: false, message: 'Username and password are required', type: 'error' });
      return false;
    }
    if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
      setAuthStatus({ success: false, message: 'Passwords do not match', type: 'error' });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate authentication process
    setAuthStatus({ success: true, message: 'Authenticating...', type: 'info' });
    
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        email: formData.email,
        role: 'user',
        lastLogin: new Date().toISOString()
      };
      
      setCurrentUser(user);
      setIsLoggedIn(true);
      setAuthStatus({ success: true, message: 'Authentication successful!', type: 'success' });
      
      // Add to blockchain
      const newBlock = {
        id: blockchainData.length + 1,
        timestamp: new Date().toISOString(),
        action: 'User Login',
        user: formData.username,
        hash: generateHash(`${formData.username}${new Date().toISOString()}`),
        signature: `sig_${Math.random().toString(36).substr(2, 10)}`
      };
      
      setBlockchainData(prev => [newBlock, ...prev]);
    }, 1500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAuthStatus({ success: true, message: 'Creating account...', type: 'info' });
    
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        email: formData.email,
        role: 'user',
        lastLogin: new Date().toISOString()
      };
      
      setCurrentUser(user);
      setIsLoggedIn(true);
      setAuthStatus({ success: true, message: 'Account created successfully!', type: 'success' });
      
      // Add to blockchain
      const newBlock = {
        id: blockchainData.length + 1,
        timestamp: new Date().toISOString(),
        action: 'New Account Created',
        user: formData.username,
        hash: generateHash(`${formData.username}${new Date().toISOString()}`),
        signature: `sig_${Math.random().toString(36).substr(2, 10)}`
      };
      
      setBlockchainData(prev => [newBlock, ...prev]);
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthStatus({ success: false, message: 'Logged out successfully', type: 'info' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">MFA Blockchain Auth</h1>
                  <p className="text-sm text-gray-300">Secure Authentication System</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Authenticated</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
                <p className="text-gray-300">{currentUser.email}</p>
                <p className="text-sm text-gray-400">Role: {currentUser.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Last Login</span>
                </div>
                <p className="text-white font-mono text-sm">{formatDate(currentUser.lastLogin)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Total Actions</span>
                </div>
                <p className="text-white font-mono text-sm">{blockchainData.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Security Level</span>
                </div>
                <p className="text-white font-mono text-sm">High</p>
              </div>
            </div>
          </motion.div>

          {/* Blockchain Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Hash className="h-6 w-6 text-blue-400" />
                <span>Blockchain Audit Trail</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {blockchainData.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          #{block.id}
                        </span>
                        <span className="text-sm text-gray-300">{formatDate(block.timestamp)}</span>
                        <span className="text-sm text-gray-300">{formatTime(block.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">{block.action}</span>
                        <span className="text-sm text-gray-400">by {block.user}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-400 font-mono break-all">
                            {block.hash.substring(0, 16)}...{block.hash.substring(block.hash.length - 8)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-400 font-mono">
                            {block.signature}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MFA Blockchain Auth</h1>
          <p className="text-gray-300">Secure Authentication with Cryptographic Integrity</p>
        </motion.div>

        {/* Auth Tabs */}
        <div className="flex bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-6 border border-white/20">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <AnimatePresence mode="wait">
            {authStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                  authStatus.type === 'success'
                    ? 'bg-green-500/20 text-green-300'
                    : authStatus.type === 'error'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {authStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : authStatus.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Activity className="h-4 w-4" />
                )}
                <span className="text-sm">{authStatus.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Security Features</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Lock className="h-4 w-4 text-green-400" />
                <span>Cryptographic Hash Functions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Blockchain Immutable Records</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Hash className="h-4 w-4 text-green-400" />
                <span>End-to-End Encryption</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Secure authentication powered by blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;