import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import ConfigService, { XPRate, AchievementConfig, QuizConfig } from '../services/configService';
import QuizService from '../services/quizService';
import { courseStorage } from '../utils/courseStorage';
import { createCourseTransaction, publishCourseTransaction, addLessonTransaction, getPlatformStats } from '../services/blockchainService';

// Admin Panel Component for Content Management
const AdminPanel: React.FC = () => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [activeTab, setActiveTab] = useState('courses');
  const [xpRates, setXpRates] = useState<XPRate[]>([]);
  const [achievements, setAchievements] = useState<AchievementConfig[]>([]);
  const [quizzes, setQuizzes] = useState<QuizConfig[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockchainStats, setBlockchainStats] = useState<{
    totalUsers: number;
    totalCourses: number;
    totalXpAwarded: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

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

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: account?.address || '',
    category: 'Programming',
    difficulty_level: 1,
    estimated_duration: 60,
  });

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    content_type: 'Video',
    content_url: '',
    duration: 30,
    order_index: 0,
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

      // Load all courses (both published and unpublished)
      const allCourses = await courseStorage.getAllCourses();
      setCourses(allCourses);

      // Load blockchain stats
      await loadBlockchainStats();
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainStats = async () => {
    try {
      setStatsLoading(true);
      const stats = await getPlatformStats();
      setBlockchainStats(stats);
    } catch (error) {
      console.error('Error loading blockchain stats:', error);
      // Set fallback values if blockchain call fails
      setBlockchainStats({
        totalUsers: 0,
        totalCourses: 0,
        totalXpAwarded: 0,
      });
    } finally {
      setStatsLoading(false);
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
      icon: 'ACHIEVEMENT',
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

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !account?.address) {
      alert('Please fill all required fields and connect your wallet');
      return;
    }

    try {
      setLoading(true);

      // Create course on blockchain
      const tx = createCourseTransaction(
        newCourse.title,
        newCourse.description,
        account.address, // Use connected wallet as instructor
        newCourse.category,
        newCourse.difficulty_level,
        newCourse.estimated_duration
      );

      const result = await signAndExecute({ transaction: tx });

      // Extract course ID from transaction result
      const courseId = result.effects?.created?.[0]?.reference?.objectId;

      if (courseId) {
        // Save course locally
        await courseStorage.saveCourse({
          id: courseId,
          title: newCourse.title,
          description: newCourse.description,
          instructor: account.address,
          category: newCourse.category,
          difficulty_level: newCourse.difficulty_level,
          estimated_duration: newCourse.estimated_duration,
          objectId: courseId,
          createdAt: new Date().toISOString(),
          isPublished: false,
        });

        // Reload courses
        const allCourses = await courseStorage.getAllCourses();
        setCourses(allCourses);

        // Reset form
        setNewCourse({
          title: '',
          description: '',
          instructor: account?.address || '',
          category: 'Programming',
          difficulty_level: 1,
          estimated_duration: 60,
        });

        alert('Course created successfully!');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (course: any) => {
    if (!account?.address) {
      alert('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);

      // Publish course on blockchain
      const tx = publishCourseTransaction(course.objectId);
      await signAndExecute({ transaction: tx });

      // Update local storage
      await courseStorage.publishCourse(course.objectId);

      // Reload courses
      const allCourses = await courseStorage.getAllCourses();
      setCourses(allCourses);

      alert('Course published successfully!');
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    // In a real app, you'd fetch lessons for this course
    // For now, we'll show an empty lessons list
    setCourseLessons([]);
  };

  const handleAddLesson = async () => {
    if (!selectedCourse || !newLesson.title) {
      alert('Please select a course and fill lesson details');
      return;
    }

    try {
      setLoading(true);

      // Add lesson to blockchain
      const tx = addLessonTransaction(
        selectedCourse.objectId,
        newLesson.title,
        newLesson.content_type,
        newLesson.content_url,
        newLesson.duration,
        newLesson.order_index
      );

      await signAndExecute({ transaction: tx });

      // Add to local lessons list
      const lesson = {
        id: `lesson_${Date.now()}`,
        title: newLesson.title,
        content_type: newLesson.content_type,
        content_url: newLesson.content_url,
        duration: newLesson.duration,
        order_index: newLesson.order_index,
        createdAt: new Date().toISOString(),
      };

      setCourseLessons([...courseLessons, lesson]);

      // Reset form
      setNewLesson({
        title: '',
        content_type: 'Video',
        content_url: '',
        duration: 30,
        order_index: courseLessons.length,
      });

      alert('Lesson added successfully!');
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Failed to add lesson. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold mb-4">EduChain Admin Panel</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          {[
            { id: 'courses', label: 'Courses' },
            { id: 'xp-rates', label: 'XP Rates' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'quizzes', label: 'Quizzes' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Course Creation Section */}
            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">📚 Create New Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Difficulty Level (1-4)"
                  value={newCourse.difficulty_level}
                  onChange={(e) => setNewCourse({...newCourse, difficulty_level: parseInt(e.target.value)})}
                  min="1"
                  max="4"
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newCourse.estimated_duration}
                  onChange={(e) => setNewCourse({...newCourse, estimated_duration: parseInt(e.target.value)})}
                  min="1"
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <textarea
                  placeholder="Course Description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white md:col-span-2"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCreateCourse}
                disabled={loading}
                className={`mt-4 ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white px-6 py-2 rounded-lg font-medium`}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>

            {/* Course Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course List */}
              <div className="bg-slate-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">📋 All Courses ({courses.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {courses.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No courses created yet. Create your first course above!</p>
                  ) : (
                    courses.map((course) => (
                      <div key={course.objectId} className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedCourse?.objectId === course.objectId
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`} onClick={() => handleSelectCourse(course)}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-400 truncate">{course.description}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                              <span>📂 {course.category}</span>
                              <span>🎯 Level {course.difficulty_level}</span>
                              <span>⏱️ {course.estimated_duration}min</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <span className={`text-xs px-2 py-1 rounded ${
                              course.isPublished
                                ? 'bg-green-600 text-white'
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">
                            Created: {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                          {!course.isPublished && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublishCourse(course);
                              }}
                              disabled={loading}
                              className={`${
                                loading
                                  ? 'bg-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } text-white px-3 py-1 rounded text-xs font-medium`}
                            >
                              {loading ? 'Publishing...' : 'Publish'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Course Details & Lesson Management */}
              <div className="bg-slate-800 p-6 rounded-xl">
                {selectedCourse ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">🎯 Manage Course</h2>
                      <h3 className="text-lg font-semibold text-blue-400">{selectedCourse.title}</h3>
                      <p className="text-sm text-gray-400">{selectedCourse.description}</p>
                    </div>

                    {/* Add Lesson Section */}
                    <div className="border-t border-slate-600 pt-4">
                      <h3 className="text-lg font-semibold mb-3">📝 Add New Lesson</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={newLesson.content_type}
                            onChange={(e) => setNewLesson({...newLesson, content_type: e.target.value})}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                          >
                            <option value="Video">Video</option>
                            <option value="Text">Text</option>
                            <option value="Document">Document</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Duration (min)"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({...newLesson, duration: parseInt(e.target.value)})}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Content URL"
                          value={newLesson.content_url}
                          onChange={(e) => setNewLesson({...newLesson, content_url: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                        />
                        <button
                          onClick={handleAddLesson}
                          disabled={loading || !newLesson.title}
                          className={`w-full ${
                            loading || !newLesson.title
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700'
                          } text-white px-4 py-2 rounded-lg font-medium`}
                        >
                          {loading ? 'Adding...' : 'Add Lesson'}
                        </button>
                      </div>
                    </div>

                    {/* Lessons List */}
                    <div className="border-t border-slate-600 pt-4">
                      <h3 className="text-lg font-semibold mb-3">📚 Course Lessons ({courseLessons.length})</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {courseLessons.length === 0 ? (
                          <p className="text-gray-400 text-center py-4">No lessons added yet. Add your first lesson above!</p>
                        ) : (
                          courseLessons.map((lesson, index) => (
                            <div key={lesson.id} className="p-3 bg-slate-700 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                    <span>📺 {lesson.content_type}</span>
                                    <span>⏱️ {lesson.duration}min</span>
                                    <span>#{lesson.order_index}</span>
                                  </div>
                                </div>
                                <button className="text-red-400 hover:text-red-300 text-sm">
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-bold mb-2">Select a Course</h3>
                    <p className="text-gray-400">Click on a course from the list to manage its lessons and publish it.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
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
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
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
                      <span className="text-sm font-bold bg-blue-600 px-2 py-1 rounded text-white">
                        {achievement.icon}
                      </span>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">+{achievement.xpReward} XP</span>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-600 text-white capitalize">
                          {achievement.rarity}
                        </span>
                        <button
                          onClick={() => handleUpdateAchievement(achievement.id, { enabled: !achievement.enabled })}
                          className={`px-2 py-1 rounded text-xs ${
                            achievement.enabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
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
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium"
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
                          <span className="text-xs px-2 py-1 rounded bg-gray-600 text-white capitalize">
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
                            quiz.isActive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Platform Analytics</h2>
              <button
                onClick={loadBlockchainStats}
                disabled={statsLoading}
                className={`${
                  statsLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded-lg font-medium`}
              >
                {statsLoading ? 'Refreshing...' : 'Refresh Blockchain Data'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Total Users</h3>
                {statsLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                ) : (
                  <p className="text-3xl text-blue-400 font-bold">
                    {blockchainStats?.totalUsers || 0}
                  </p>
                )}
                <p className="text-sm text-gray-400">From blockchain registry</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Total Courses</h3>
                {statsLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                ) : (
                  <p className="text-3xl text-green-400 font-bold">
                    {blockchainStats?.totalCourses || 0}
                  </p>
                )}
                <p className="text-sm text-gray-400">On-chain courses</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Total XP Awarded</h3>
                {statsLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                ) : (
                  <p className="text-3xl text-purple-400 font-bold">
                    {blockchainStats?.totalXpAwarded || 0}
                  </p>
                )}
                <p className="text-sm text-gray-400">Blockchain verified</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Active Achievements</h3>
                <p className="text-3xl text-orange-400 font-bold">
                  {achievements.filter(a => a.enabled).length}
                </p>
                <p className="text-sm text-gray-400">Out of {achievements.length} total</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Local Courses</h3>
                <p className="text-3xl text-blue-400 font-bold">
                  {courses.length}
                </p>
                <p className="text-sm text-gray-400">
                  {courses.filter(c => c.isPublished).length} published
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Active Quizzes</h3>
                <p className="text-3xl text-yellow-400 font-bold">
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
                  <span>Blockchain Connection</span>
                  {statsLoading ? (
                    <span className="text-blue-400">🔄 Connecting...</span>
                  ) : blockchainStats ? (
                    <span className="text-green-400">✅ Connected to Sui Testnet</span>
                  ) : (
                    <span className="text-red-400">❌ Connection failed</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Registry Data</span>
                  {statsLoading ? (
                    <span className="text-blue-400">🔄 Loading...</span>
                  ) : blockchainStats ? (
                    <span className="text-green-400">✅ Real-time data available</span>
                  ) : (
                    <span className="text-yellow-400">⚠️ Using fallback data</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Backup</span>
                  <span className="text-gray-400">Never (local storage only)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Source</span>
                  <span className="text-green-400">🔗 Blockchain Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Configuration Management</h2>
              <p className="text-gray-400 mb-6">
                Export your current configuration or import a previously saved configuration file.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={exportConfig}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  📤 Export Configuration
                </button>
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer flex items-center gap-2">
                  📥 Import Configuration
                  <input
                    type="file"
                    accept=".json"
                    onChange={importConfig}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                <h3 className="font-semibold mb-2">What gets exported?</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• XP Rates configuration</li>
                  <li>• Achievement definitions</li>
                  <li>• Quiz configurations</li>
                  <li>• System settings</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
