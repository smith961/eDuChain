import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import XPService, { UserXP, Achievement, NFT } from '../services/xpService';
import QuizService, { QuizResult } from '../services/quizService';
import ConfigService, { QuizConfig } from '../services/configService';

// Unique Learning Features Component
const LearningDashboard: React.FC = () => {
  const account = useCurrentAccount();
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizConfig[]>([]);
  const [learningStreak, setLearningStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(50); // XP goal per day
  const [todayXP, setTodayXP] = useState(0);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account?.address) {
      loadUserData();
    }
  }, [account]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Load XP data
      const xpData = XPService.getUserXP(account!.address);
      setUserXP(xpData);

      // Load available quizzes
      const quizzes = QuizService.getQuizzes();
      setAvailableQuizzes(quizzes);

      // Calculate learning streak and today's XP
      calculateStreakAndTodayXP(xpData);

      // Generate adaptive recommendations
      generateAdaptiveRecommendations(xpData, quizzes);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreakAndTodayXP = (xpData: UserXP) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayXP = xpData.transactions
      .filter(tx => {
        const txDate = new Date(tx.timestamp);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime();
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    setTodayXP(todayXP);

    // Calculate streak (simplified - in real app, track consecutive days)
    const recentDays = xpData.transactions
      .filter(tx => tx.type !== 'bonus')
      .slice(-7);

    const uniqueDays = [...new Set(recentDays.map(tx =>
      new Date(tx.timestamp).toDateString()
    ))].length;

    setLearningStreak(uniqueDays);
  };

  const generateAdaptiveRecommendations = (xpData: UserXP, quizzes: QuizConfig[]) => {
    const recommendations: string[] = [];

    // Analyze user performance
    const quizAttempts = xpData.transactions.filter(tx => tx.type === 'quiz_completion');
    const lessonAttempts = xpData.transactions.filter(tx => tx.type === 'lesson_completion');

    // Difficulty-based recommendations
    if (quizAttempts.length > 0) {
      const avgQuizScore = quizAttempts.reduce((sum, tx) => {
        // Extract score from reason (simplified)
        const scoreMatch = tx.reason.match(/(\d+)%/);
        return sum + (scoreMatch ? parseInt(scoreMatch[1]) : 0);
      }, 0) / quizAttempts.length;

      if (avgQuizScore > 85) {
        recommendations.push("🎯 You're excelling! Try advanced topics");
      } else if (avgQuizScore < 60) {
        recommendations.push("📚 Focus on fundamentals before advancing");
      }
    }

    // Learning pattern analysis
    if (lessonAttempts.length < 3) {
      recommendations.push("🚀 Start with interactive lessons for better engagement");
    }

    // Streak-based motivation
    if (learningStreak >= 5) {
      recommendations.push("🔥 Keep the momentum! You're on fire!");
    } else if (learningStreak === 0) {
      recommendations.push("🌟 Begin your learning journey today!");
    }

    // Quiz recommendations
    const unattemptedQuizzes = quizzes.filter(quiz => {
      const userAttempts = QuizService.getUserAttempts(account!.address, quiz.id);
      return userAttempts.length === 0;
    });

    if (unattemptedQuizzes.length > 0) {
      const recommendedQuiz = unattemptedQuizzes[0];
      recommendations.push(`🧠 Try: ${recommendedQuiz.title}`);
    }

    setAdaptiveRecommendations(recommendations);
  };

  const getMotivationalMessage = () => {
    const progressPercent = (todayXP / dailyGoal) * 100;

    if (progressPercent >= 100) {
      return {
        message: "🎉 Goal achieved! You're unstoppable!",
        color: "text-green-600",
        bgColor: "bg-green-50"
      };
    } else if (progressPercent >= 75) {
      return {
        message: "🚀 Almost there! Keep pushing!",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      };
    } else if (progressPercent >= 50) {
      return {
        message: "💪 You're doing great! Stay focused!",
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      };
    } else {
      return {
        message: "🌟 Every step counts! Let's get started!",
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      };
    }
  };

  const getLearningInsights = () => {
    if (!userXP) return [];

    const insights = [];

    // Time-based insights
    const recentActivity = userXP.transactions.slice(-5);
    if (recentActivity.length > 0) {
      const avgTimeBetweenActivities = recentActivity
        .slice(1)
        .reduce((sum, tx, index) => {
          const timeDiff = tx.timestamp - recentActivity[index].timestamp;
          return sum + timeDiff;
        }, 0) / (recentActivity.length - 1);

      if (avgTimeBetweenActivities < 24 * 60 * 60 * 1000) { // Less than 24 hours
        insights.push("⚡ You're learning consistently! Great job!");
      }
    }

    // Achievement progress
    const unlockedAchievements = userXP.achievements.filter(a => a.unlocked).length;
    const totalAchievements = userXP.achievements.length;
    const achievementProgress = (unlockedAchievements / totalAchievements) * 100;

    if (achievementProgress > 75) {
      insights.push("🏆 You're collecting achievements like a pro!");
    }

    // XP velocity
    const recentXP = userXP.transactions
      .filter(tx => tx.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (recentXP > 500) {
      insights.push("📈 Your XP growth is impressive!");
    }

    return insights;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userXP || !account) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Please connect your wallet to view your learning dashboard</p>
        </div>
      </div>
    );
  }

  const motivationalData = getMotivationalMessage();
  const insights = getLearningInsights();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header with Motivational Message */}
        <div className={`${motivationalData.bgColor} p-6 rounded-2xl border border-slate-700`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Learner! 👋
              </h1>
              <p className={`${motivationalData.color} font-medium text-lg`}>
                {motivationalData.message}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{userXP.totalXP}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Daily Goal Progress */}
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">🎯 Daily Goal</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Today's XP</span>
                <span>{todayXP} / {dailyGoal}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((todayXP / dailyGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">
                {dailyGoal - todayXP > 0
                  ? `${dailyGoal - todayXP} XP to go!`
                  : "Goal completed! 🎉"
                }
              </p>
            </div>
          </div>

          {/* Learning Streak */}
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">🔥 Learning Streak</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">{learningStreak}</div>
              <div className="text-sm text-gray-400">days in a row</div>
              <div className="flex justify-center mt-3 space-x-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < learningStreak ? 'bg-orange-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">📊 Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-bold text-blue-400">{userXP.currentLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Achievements:</span>
                <span className="font-bold text-purple-400">
                  {userXP.achievements.filter(a => a.unlocked).length}/{userXP.achievements.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>NFTs:</span>
                <span className="font-bold text-green-400">{userXP.nfts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Quizzes Passed:</span>
                <span className="font-bold text-yellow-400">
                  {userXP.transactions.filter(t => t.type === 'quiz_completion').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Recommendations */}
        {adaptiveRecommendations.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">🧠 Smart Recommendations</h3>
            <div className="space-y-3">
              {adaptiveRecommendations.map((rec, index) => (
                <div key={index} className="bg-white bg-opacity-10 p-4 rounded-lg">
                  <p className="text-white">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Insights */}
        {insights.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">💡 Learning Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="bg-slate-700 p-4 rounded-lg">
                  <p className="text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Quizzes */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🧠 Available Quizzes</h3>
          {availableQuizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableQuizzes.slice(0, 6).map((quiz) => {
                const userAttempts = QuizService.getUserAttempts(account.address, quiz.id);
                const bestScore = userAttempts.length > 0
                  ? Math.max(...userAttempts.map(a => a.score))
                  : 0;

                return (
                  <div key={quiz.id} className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-bold text-white mb-2">{quiz.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{quiz.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                      <span>Difficulty: {quiz.difficulty}</span>
                      <span>XP: {quiz.xpReward}</span>
                    </div>
                    {bestScore > 0 && (
                      <div className="text-sm text-green-400 mb-3">
                        Best Score: {bestScore}%
                      </div>
                    )}
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      onClick={() => window.location.href = `/lesson/${quiz.courseId}`}
                    >
                      {userAttempts.length > 0 ? 'Retake Quiz' : 'Take Quiz'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievement Progress */}
        <div className="bg-slate-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🏆 Achievement Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userXP.achievements.slice(0, 6).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.unlocked
                    ? 'border-green-400 bg-green-900 bg-opacity-20'
                    : 'border-slate-600 bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.name}</h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-400">+{achievement.xpReward} XP</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    achievement.unlocked ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-400'
                  }`}>
                    {achievement.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningDashboard;