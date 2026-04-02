import React, { useState, useEffect } from 'react';
import { apiKeyService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Key, Plus, Trash2, Copy, Check, AlertCircle, Shield, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApiKeyPage = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const data = await apiKeyService.getAllApiKeys();
      setApiKeys(data);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
      setError('Could not load your API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      setIsGenerating(true);
      setError('');
      const data = await apiKeyService.generateApiKey(newKeyName);
      setGeneratedKey({ 
        key: data.apiKey, 
        name: newKeyName 
      });
      setNewKeyName('');
      fetchApiKeys(); // Refresh the list
    } catch (err) {
      console.error('Failed to generate API key:', err);
      setError('Failed to generate API key. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiKeyService.revokeApiKey(keyId);
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
    } catch (err) {
      console.error('Failed to revoke API key:', err);
      setError('Failed to revoke API key.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            API <span className="text-indigo-600">Keys</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold max-w-xl">
            Securely access the LinkMagic API from your own applications. 
            Keep your keys private and never share them.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 rounded-3xl border border-indigo-100 dark:border-indigo-500/10">
          <Shield className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Security Status</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Active Protection On</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* Left: Generate Form & Success State */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-white/20 shadow-xl space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Plus className="w-5 h-5 text-indigo-600" />
              Generate New Key
            </h3>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Key Name</label>
                <input
                  type="text"
                  placeholder="e.g. Production Mobile App"
                  className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 font-bold text-gray-700 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating || !newKeyName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create API Key</>
                )}
              </button>
            </form>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/10 p-4 rounded-2xl flex gap-3 italic">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
                Keys provide full access to your account. Do not commit them to version control.
              </p>
            </div>
          </div>

          {/* Generated Key Success Message */}
          <AnimatePresence>
            {generatedKey && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-8 rounded-[2.5rem] border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-2xl space-y-6 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4">
                  <button 
                    onClick={() => setGeneratedKey(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-800 dark:text-emerald-400">Key Generated!</h4>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-500/70">Copy it now, you won't see it again.</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="bg-white dark:bg-[#0B0F19] p-5 rounded-2xl border border-emerald-200 dark:border-white/5 font-mono text-sm break-all pr-12 text-gray-800 dark:text-gray-200 shadow-inner">
                    {generatedKey.key}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedKey.key)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 p-3 bg-indigo-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Keys List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Key className="w-5 h-5 text-indigo-600" />
              Existing Keys
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{apiKeys.length} Active Keys</span>
          </div>

          {loading ? (
             <div className="glass p-12 rounded-[2.5rem] border-white/10 text-center animate-pulse">
                <p className="font-black text-indigo-500 uppercase tracking-widest">Loading keys...</p>
             </div>
          ) : apiKeys.length === 0 ? (
            <div className="glass p-16 rounded-[3.5rem] border-dashed border-2 border-gray-200 dark:border-white/5 text-center space-y-6">
               <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                  <Key className="w-8 h-8" />
               </div>
               <div className="space-y-1">
                  <p className="text-xl font-black text-gray-900 dark:text-white">No API keys yet</p>
                  <p className="text-sm text-gray-500 font-bold">Generate your first key to start using the API.</p>
               </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {apiKeys.map((key) => (
                <motion.div
                  layout
                  key={key.id}
                  className="glass p-6 rounded-3xl border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Key className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{key.name}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(key.createdAt)}</span>
                         {key.lastUsedAt && <span className="flex items-center gap-1 text-emerald-500"><Clock className="w-3 h-3" /> Last used {formatDate(key.lastUsedAt)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${key.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                       {key.isActive ? 'Active' : 'Revoked'}
                    </div>
                    <button
                      onClick={() => handleRevokeKey(key.id)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/10 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPage;
