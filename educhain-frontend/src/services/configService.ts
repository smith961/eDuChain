export interface XPRate {
  id: string;
  name: string;
  amount: number;
  description: string;
  category: 'learning' | 'achievement' | 'social' | 'bonus';
  enabled: boolean;
}

export interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'learning' | 'social' | 'completion' | 'streak' | 'achievement';
  trigger: {
    type: 'action_count' | 'xp_threshold' | 'time_based' | 'custom';
    condition: any;
  };
  enabled: boolean;
  blockchainVerified: boolean;
}

export interface QuizConfig {
  id: string;
  title: string;
  description: string;
  courseId: string;
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  questions: QuizQuestion[];
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'code';
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  points: number;
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[]; // course IDs
  prerequisites: string[]; // learning path IDs
  estimatedDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  rewards: {
    completionXP: number;
    nftReward?: string;
    certificate?: boolean;
  };
  isActive: boolean;
}

export interface GamificationConfig {
  id: string;
  name: string;
  type: 'streak' | 'milestone' | 'competition' | 'challenge';
  description: string;
  rules: any;
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
  duration?: number; // in days
  participants?: string[]; // user IDs
  isActive: boolean;
}

class ConfigService {
  private static readonly STORAGE_KEY = 'educhain_config';

  // Default XP rates
  private static readonly DEFAULT_XP_RATES: XPRate[] = [
    {
      id: 'lesson_completion',
      name: 'Lesson Completion',
      amount: 50,
      description: 'XP awarded for completing a lesson',
      category: 'learning',
      enabled: true,
    },
    {
      id: 'quiz_completion',
      name: 'Quiz Completion',
      amount: 100,
      description: 'XP awarded for passing a quiz',
      category: 'learning',
      enabled: true,
    },
    {
      id: 'course_completion',
      name: 'Course Completion',
      amount: 200,
      description: 'XP awarded for completing an entire course',
      category: 'achievement',
      enabled: true,
    },
    {
      id: 'daily_login',
      name: 'Daily Login',
      amount: 10,
      description: 'XP awarded for daily login streak',
      category: 'bonus',
      enabled: true,
    },
    {
      id: 'peer_help',
      name: 'Peer Help',
      amount: 25,
      description: 'XP awarded for helping other learners',
      category: 'social',
      enabled: true,
    },
    {
      id: 'content_creation',
      name: 'Content Creation',
      amount: 150,
      description: 'XP awarded for creating course content',
      category: 'achievement',
      enabled: true,
    },
  ];

  // Default achievements
  private static readonly DEFAULT_ACHIEVEMENTS: AchievementConfig[] = [
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '👶',
      xpReward: 25,
      rarity: 'common',
      category: 'learning',
      trigger: {
        type: 'action_count',
        condition: { action: 'lesson_completion', count: 1 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      icon: '🧠',
      xpReward: 100,
      rarity: 'common',
      category: 'learning',
      trigger: {
        type: 'action_count',
        condition: { action: 'lesson_completion', count: 5 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      description: 'Pass 10 quizzes',
      icon: '🎯',
      xpReward: 250,
      rarity: 'rare',
      category: 'learning',
      trigger: {
        type: 'action_count',
        condition: { action: 'quiz_completion', count: 10 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'course_creator',
      name: 'Course Creator',
      description: 'Create your first course',
      icon: '🎓',
      xpReward: 150,
      rarity: 'rare',
      category: 'achievement',
      trigger: {
        type: 'action_count',
        condition: { action: 'course_creation', count: 1 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'streak_master',
      name: 'Consistency Champion',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      xpReward: 300,
      rarity: 'epic',
      category: 'streak',
      trigger: {
        type: 'custom',
        condition: { type: 'streak', days: 7 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'blockchain_pioneer',
      name: 'Blockchain Pioneer',
      description: 'Complete 3 blockchain-related courses',
      icon: '⛓️',
      xpReward: 500,
      rarity: 'epic',
      category: 'learning',
      trigger: {
        type: 'custom',
        condition: { type: 'course_completion', tags: ['blockchain'], count: 3 },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'move_expert',
      name: 'Move Language Expert',
      description: 'Master advanced Move programming concepts',
      icon: '⚡',
      xpReward: 1000,
      rarity: 'legendary',
      category: 'learning',
      trigger: {
        type: 'custom',
        condition: { type: 'skill_mastery', skill: 'move', level: 'expert' },
      },
      enabled: true,
      blockchainVerified: true,
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Help 50 fellow learners',
      icon: '👑',
      xpReward: 750,
      rarity: 'legendary',
      category: 'social',
      trigger: {
        type: 'action_count',
        condition: { action: 'peer_help', count: 50 },
      },
      enabled: true,
      blockchainVerified: true,
    },
  ];

  // Get XP rates
  static getXPRates(): XPRate[] {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_xp_rates`);
    return stored ? JSON.parse(stored) : this.DEFAULT_XP_RATES;
  }

  // Update XP rate
  static updateXPRate(rateId: string, updates: Partial<XPRate>): void {
    const rates = this.getXPRates();
    const index = rates.findIndex(r => r.id === rateId);
    if (index !== -1) {
      rates[index] = { ...rates[index], ...updates };
      localStorage.setItem(`${this.STORAGE_KEY}_xp_rates`, JSON.stringify(rates));
    }
  }

  // Get achievements
  static getAchievements(): AchievementConfig[] {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_achievements`);
    return stored ? JSON.parse(stored) : this.DEFAULT_ACHIEVEMENTS;
  }

  // Update achievement
  static updateAchievement(achievementId: string, updates: Partial<AchievementConfig>): void {
    const achievements = this.getAchievements();
    const index = achievements.findIndex(a => a.id === achievementId);
    if (index !== -1) {
      achievements[index] = { ...achievements[index], ...updates };
      localStorage.setItem(`${this.STORAGE_KEY}_achievements`, JSON.stringify(achievements));
    }
  }

  // Get XP rate by ID
  static getXPRateById(rateId: string): XPRate | undefined {
    return this.getXPRates().find(r => r.id === rateId && r.enabled);
  }

  // Get achievement by ID
  static getAchievementById(achievementId: string): AchievementConfig | undefined {
    return this.getAchievements().find(a => a.id === achievementId && a.enabled);
  }

  // Get achievements by category
  static getAchievementsByCategory(category: string): AchievementConfig[] {
    return this.getAchievements().filter(a => a.category === category && a.enabled);
  }

  // Get XP rates by category
  static getXPRatesByCategory(category: string): XPRate[] {
    return this.getXPRates().filter(r => r.category === category && r.enabled);
  }

  // Calculate XP for action
  static calculateXP(actionType: string, context?: any): number {
    const rate = this.getXPRateById(actionType);
    if (!rate) return 0;

    let multiplier = 1;

    // Apply difficulty multiplier
    if (context?.difficulty) {
      switch (context.difficulty) {
        case 'easy': multiplier = 0.8; break;
        case 'medium': multiplier = 1; break;
        case 'hard': multiplier = 1.2; break;
        case 'expert': multiplier = 1.5; break;
      }
    }

    // Apply streak bonus
    if (context?.streak && context.streak > 1) {
      multiplier *= Math.min(1 + (context.streak - 1) * 0.1, 2); // Max 2x bonus
    }

    return Math.round(rate.amount * multiplier);
  }

  // Check if achievement should be unlocked
  static checkAchievementUnlock(achievementId: string, userStats: any): boolean {
    const achievement = this.getAchievementById(achievementId);
    if (!achievement) return false;

    const { trigger } = achievement;

    switch (trigger.type) {
      case 'action_count':
        const actionCount = userStats[trigger.condition.action] || 0;
        return actionCount >= trigger.condition.count;

      case 'xp_threshold':
        return userStats.totalXP >= trigger.condition.threshold;

      case 'time_based':
        // Implement time-based logic
        return false;

      case 'custom':
        return this.evaluateCustomCondition(trigger.condition, userStats);

      default:
        return false;
    }
  }

  private static evaluateCustomCondition(condition: any, userStats: any): boolean {
    switch (condition.type) {
      case 'streak':
        return (userStats.currentStreak || 0) >= condition.days;

      case 'course_completion':
        const completedCourses = userStats.completedCourses || [];
        const matchingCourses = completedCourses.filter((course: any) =>
          condition.tags ? condition.tags.some((tag: string) => course.tags?.includes(tag)) : true
        );
        return matchingCourses.length >= condition.count;

      case 'skill_mastery':
        return userStats.skillLevels?.[condition.skill] === condition.level;

      default:
        return false;
    }
  }

  // Reset to defaults
  static resetToDefaults(): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_xp_rates`);
    localStorage.removeItem(`${this.STORAGE_KEY}_achievements`);
  }

  // Export configuration
  static exportConfig(): any {
    return {
      xpRates: this.getXPRates(),
      achievements: this.getAchievements(),
      exportedAt: Date.now(),
    };
  }

  // Import configuration
  static importConfig(config: any): void {
    if (config.xpRates) {
      localStorage.setItem(`${this.STORAGE_KEY}_xp_rates`, JSON.stringify(config.xpRates));
    }
    if (config.achievements) {
      localStorage.setItem(`${this.STORAGE_KEY}_achievements`, JSON.stringify(config.achievements));
    }
  }
}

export default ConfigService;