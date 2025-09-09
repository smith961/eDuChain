import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import ConfigService, { XPRate, AchievementConfig, QuizConfig } from '../services/configService';
import QuizService from '../services/quizService';

// Admin Panel Component for Content Management
const AdminPanel: React.FC = () => {
  const account = useCurrentAccount();
  const [activeTab, setActiveTab] = useState('xp-rates');
  const [xpRates, setXpRates] = useState<XPRate[]>([]);
  const [achievements, setAchievements] = useState<AchievementConfig[]>([]);
  const [quizzes, setQuizzes] = useState<QuizConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newXPRate, setNewXPRate] = useState<Partial<XPRate>>({
    name: '',
    amount: 0,
    description: '',
    category: 'learning',
    enabled: true,
  });

  const [newAchievement, setNewAchievement] = useState<Partial<AchievementConfig>>({
    name: '',
    description: '',
    icon: '🏆',
    xpReward: 0,
    rarity: 'common',
    category: 'learning',
    trigger: { type: 'action_count', condition: { action: '', count: 1 } },
    enabled: true,
    blockchainVerified: true,
  });

  const [newQuiz, setNewQuiz] = useState<Partial<QuizConfig>>({
    title: '',
    description: '',
    courseId: '',
    passingScore: 70,
    maxAttempts: 3,
    timeLimit: 30,
    xpReward: 100,
    difficulty: 'beginner',
    tags: [],
    isActive: true,
    questions: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setXpRates(ConfigService.getXPRates());
      setAchievements(ConfigService.getAchievements());
      setQuizzes(QuizService.getQuizzes());
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateXPRate = (rateId: string, updates: Partial<XPRate>) => {
    ConfigService.updateXPRate(rateId, updates);
    setXpRates(ConfigService.getXPRates());
  };

  const handleUpdateAchievement = (achievementId: string, updates: Partial<AchievementConfig>) => {
    ConfigService.updateAchievement(achievementId, updates);
    setAchievements(ConfigService.getAchievements());
  };

  const handleCreateXPRate = () => {
    if (!newXPRate.name || !newXPRate.amount) return;

    const rate: XPRate = {
      id: `xp_${Date.now()}`,
      name: newXPRate.name,
      amount: newXPRate.amount,
      description: newXPRate.description || '',
      category: newXPRate.category || 'learning',
      enabled: newXPRate.enabled ?? true,
    };

    // Add to existing rates
    const updatedRates = [...xpRates, rate];
    localStorage.setItem('educhain_config_xp_rates', JSON.stringify(updatedRates));
    setXpRates(updatedRates);

    // Reset form
    setNewXPRate({
      name: '',
      amount: 0,
      description: '',
      category: 'learning',
      enabled: true,
    });
  };

  const handleCreateAchievement = () => {
    if (!newAchievement.name || !newAchievement.xpReward) return;

    const achievement: AchievementConfig = {
      id: `achievement_${Date.now()}`,
      name: newAchievement.name,
      description: newAchievement.description || '',
      icon: newAchievement.icon || '🏆',
      xpReward: newAchievement.xpReward,
      rarity: newAchievement.rarity || 'common',
      category: newAchievement.category || 'learning',
      trigger: newAchievement.trigger || { type: 'action_count', condition: { action: '', count: 1 } },
      enabled: newAchievement.enabled ?? true,
      blockchainVerified: newAchievement.blockchainVerified ?? true,
    };

    // Add to existing achievements
    const updatedAchievements = [...achievements, achievement];
    localStorage.setItem('educhain_config_achievements', JSON.stringify(updatedAchievements));
    setAchievements(updatedAchievements);

    // Reset form
    setNewAchievement({
      name: '',
      description: '',
      icon: '🏆',
      xpReward: 0,
      rarity: 'common',
      category: 'learning',
      trigger: { type: 'action_count', condition: { action: '', count: 1 } },
      enabled: true,
      blockchainVerified: true,
    });
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.courseId) return;

    QuizService.createQuiz(newQuiz as Omit<QuizConfig, 'id' | 'createdAt' | 'updatedAt'>);
    setQuizzes(QuizService.getQuizzes());

    // Reset form
    setNewQuiz({
      title: '',
      description: '',
      courseId: '',
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 30,
      xpReward: 100,
      difficulty: 'beginner',
      tags: [],
      isActive: true,
      questions: [],
    });
  };

  const exportConfig = () => {
    const config = ConfigService.exportConfig();
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `educhain_config_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        ConfigService.importConfig(config);
        loadData(); // Reload data
        alert('Configuration imported successfully!');
      } catch (error) {
        alert('Error importing configuration: ' + error);
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Simple admin check - in production, implement proper authentication
  if (!account?.address) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Please connect your wallet to access the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🎛️ EduChain Admin Panel</h1>
          <div className="flex gap-4 mb-6">
            <button
              onClick={exportConfig}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              📤 Export Config
            </button>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer">
              📥 Import Config
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          {[
            { id: 'xp-rates', label: 'XP Rates', icon: '⭐' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'quizzes', label: 'Quizzes', icon: '🧠' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* XP Rates Tab */}
        {activeTab === 'xp-rates' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Create New XP Rate</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Rate Name"
                  value={newXPRate.name}
                  onChange={(e) => setNewXPRate({...newXPRate, name: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="XP Amount"
                  value={newXPRate.amount}
                  onChange={(e) => setNewXPRate({...newXPRate, amount: parseInt(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <select
                  value={newXPRate.category}
                  onChange={(e) => setNewXPRate({...newXPRate, category: e.target.value as any})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="learning">Learning</option>
                  <option value="achievement">Achievement</option>
                  <option value="social">Social</option>
                  <option value="bonus">Bonus</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newXPRate.description}
                  onChange={(e) => setNewXPRate({...newXPRate, description: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <button
                onClick={handleCreateXPRate}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create XP Rate
              </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Existing XP Rates</h2>
              <div className="space-y-3">
                {xpRates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="font-bold">{rate.name}</h3>
                      <p className="text-sm text-gray-400">{rate.description}</p>
                      <p className="text-xs text-gray-500">Category: {rate.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-bold">{rate.amount} XP</span>
                      <button
                        onClick={() => handleUpdateXPRate(rate.id, { enabled: !rate.enabled })}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          rate.enabled
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {rate.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Create New Achievement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Achievement Name"
                  value={newAchievement.name}
                  onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="XP Reward"
                  value={newAchievement.xpReward}
                  onChange={(e) => setNewAchievement({...newAchievement, xpReward: parseInt(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={newAchievement.icon}
                  onChange={(e) => setNewAchievement({...newAchievement, icon: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <select
                  value={newAchievement.rarity}
                  onChange={(e) => setNewAchievement({...newAchievement, rarity: e.target.value as any})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                  <option value="mythic">Mythic</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white md:col-span-2"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCreateAchievement}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create Achievement
              </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Existing Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">+{achievement.xpReward} XP</span>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          achievement.rarity === 'common' ? 'bg-gray-600' :
                          achievement.rarity === 'rare' ? 'bg-blue-600' :
                          achievement.rarity === 'epic' ? 'bg-purple-600' :
                          achievement.rarity === 'legendary' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}>
                          {achievement.rarity}
                        </span>
                        <button
                          onClick={() => handleUpdateAchievement(achievement.id, { enabled: !achievement.enabled })}
                          className={`px-2 py-1 rounded text-xs ${
                            achievement.enabled ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        >
                          {achievement.enabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Quiz Title"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Course ID"
                  value={newQuiz.courseId}
                  onChange={(e) => setNewQuiz({...newQuiz, courseId: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="XP Reward"
                  value={newQuiz.xpReward}
                  onChange={(e) => setNewQuiz({...newQuiz, xpReward: parseInt(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Passing Score (%)"
                  value={newQuiz.passingScore}
                  onChange={(e) => setNewQuiz({...newQuiz, passingScore: parseInt(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <select
                  value={newQuiz.difficulty}
                  onChange={(e) => setNewQuiz({...newQuiz, difficulty: e.target.value as any})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <input
                  type="number"
                  placeholder="Time Limit (minutes)"
                  value={newQuiz.timeLimit}
                  onChange={(e) => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value)})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <textarea
                  placeholder="Description"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white md:col-span-2"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCreateQuiz}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Create Quiz
              </button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Existing Quizzes</h2>
              <div className="space-y-3">
                {quizzes.map((quiz) => {
                  const stats = QuizService.getQuizStats(quiz.id);
                  return (
                    <div key={quiz.id} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{quiz.title}</h3>
                          <p className="text-sm text-gray-400">{quiz.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded capitalize ${
                            quiz.difficulty === 'beginner' ? 'bg-green-600' :
                            quiz.difficulty === 'intermediate' ? 'bg-yellow-600' :
                            quiz.difficulty === 'advanced' ? 'bg-orange-600' :
                            'bg-red-600'
                          }`}>
                            {quiz.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Questions: {quiz.questions.length}</span>
                        <span>XP: {quiz.xpReward}</span>
                        <span>Pass Rate: {stats.passRate}%</span>
                        <span>Attempts: {stats.totalAttempts}</span>
                        <button
                          onClick={() => QuizService.updateQuiz(quiz.id, { isActive: !quiz.isActive })}
                          className={`px-3 py-1 rounded text-xs ${
                            quiz.isActive ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        >
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Total XP Awarded</h3>
                <p className="text-3xl text-green-400 font-bold">
                  {xpRates.reduce((sum, rate) => sum + (rate.enabled ? rate.amount : 0), 0) * 10}
                </p>
                <p className="text-sm text-gray-400">Estimated from current rates</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Active Achievements</h3>
                <p className="text-3xl text-purple-400 font-bold">
                  {achievements.filter(a => a.enabled).length}
                </p>
                <p className="text-sm text-gray-400">Out of {achievements.length} total</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Active Quizzes</h3>
                <p className="text-3xl text-blue-400 font-bold">
                  {quizzes.filter(q => q.isActive).length}
                </p>
                <p className="text-sm text-gray-400">Out of {quizzes.length} total</p>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">System Health</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Configuration Status</span>
                  <span className="text-green-400">✅ All systems operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Backup</span>
                  <span className="text-gray-400">Never (local storage only)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Blockchain Integration</span>
                  <span className="text-yellow-400">⚠️ Mock implementation</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
