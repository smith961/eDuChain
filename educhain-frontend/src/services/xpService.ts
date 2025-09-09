// XP Service - Simulates blockchain XP behavior without modifying Move code
export interface XPTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
  type: 'lesson_completion' | 'quiz_completion' | 'course_completion' | 'daily_login' | 'achievement' | 'bonus';
  blockchainVerified: boolean;
  txHash?: string;
}

export interface UserXP {
  totalXP: number;
  currentLevel: number;
  availableXP: number;
  nextLevelXP: number;
  transactions: XPTransaction[];
  achievements: Achievement[];
  nfts: NFT[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  blockchainVerified: boolean;
}

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  achievement: string;
  rarity: string;
  mintedAt: number;
  contractAddress: string;
  tokenId: string;
}

class XPService {
  private static readonly STORAGE_KEY = 'educhain_xp_data';
  private static readonly ACHIEVEMENTS_KEY = 'educhain_achievements';
  private static readonly NFTS_KEY = 'educhain_nfts';

  // XP earning rates (matching Move contract constants)
  private static readonly XP_RATES = {
    LESSON_COMPLETION: 50,
    QUIZ_COMPLETION: 100,
    COURSE_COMPLETION: 200,
    DAILY_LOGIN: 10,
    ACHIEVEMENT_UNLOCK: 0, // XP comes from achievement itself
  };

  // Level thresholds (matching Move contract)
  private static readonly LEVEL_THRESHOLDS = [
    0, 500, 1000, 2000, 4000, 8000, 15000, 25000, 40000, 60000
  ];

  static async awardXP(
    userId: string,
    amount: number,
    reason: string,
    type: XPTransaction['type'] = 'bonus'
  ): Promise<UserXP> {
    const userXP = this.getUserXP(userId);

    // Create transaction
    const transaction: XPTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      reason,
      timestamp: Date.now(),
      type,
      blockchainVerified: true, // Simulate blockchain verification
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
    };

    // Update XP
    userXP.totalXP += amount;
    userXP.currentLevel = this.calculateLevel(userXP.totalXP);
    userXP.nextLevelXP = this.getNextLevelXP(userXP.currentLevel);
    userXP.availableXP = userXP.totalXP; // All XP is available for now
    userXP.transactions.unshift(transaction); // Add to beginning

    // Check for achievements
    await this.checkAchievements(userId, type, userXP.totalXP);

    // Save updated data
    this.saveUserXP(userId, userXP);

    return userXP;
  }

  static getUserXP(userId: string): UserXP {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // Return default user XP
    return {
      totalXP: 0,
      currentLevel: 1,
      availableXP: 0,
      nextLevelXP: 500,
      transactions: [],
      achievements: this.getDefaultAchievements(),
      nfts: [],
    };
  }

  static calculateLevel(totalXP: number): number {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= this.LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  static getNextLevelXP(currentLevel: number): number {
    if (currentLevel < this.LEVEL_THRESHOLDS.length) {
      return this.LEVEL_THRESHOLDS[currentLevel];
    }
    // For levels beyond defined thresholds, increase exponentially
    return this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1] +
           (currentLevel - this.LEVEL_THRESHOLDS.length + 1) * 10000;
  }

  private static getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_login',
        name: 'Welcome to EduChain',
        description: 'Successfully connected your wallet',
        icon: '👋',
        xpReward: 25,
        unlocked: false,
        rarity: 'common',
        blockchainVerified: true,
      },
      {
        id: 'first_quiz',
        name: 'Knowledge Seeker',
        description: 'Completed your first enrollment quiz',
        icon: '🧠',
        xpReward: 50,
        unlocked: false,
        rarity: 'common',
        blockchainVerified: true,
      },
      {
        id: 'first_lesson',
        name: 'Learning Journey Begins',
        description: 'Completed your first lesson',
        icon: '📚',
        xpReward: 75,
        unlocked: false,
        rarity: 'common',
        blockchainVerified: true,
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Passed 5 quizzes with perfect scores',
        icon: '🎯',
        xpReward: 200,
        unlocked: false,
        rarity: 'rare',
        blockchainVerified: true,
      },
      {
        id: 'course_creator',
        name: 'Course Creator',
        description: 'Created your first course',
        icon: '🎓',
        xpReward: 150,
        unlocked: false,
        rarity: 'rare',
        blockchainVerified: true,
      },
      {
        id: 'streak_master',
        name: 'Consistency Champion',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        xpReward: 300,
        unlocked: false,
        rarity: 'epic',
        blockchainVerified: true,
      },
      {
        id: 'web3_pioneer',
        name: 'Web3 Pioneer',
        description: 'Completed 3 blockchain courses',
        icon: '🚀',
        xpReward: 500,
        unlocked: false,
        rarity: 'epic',
        blockchainVerified: true,
      },
      {
        id: 'move_master',
        name: 'Move Language Master',
        description: 'Mastered Move programming fundamentals',
        icon: '⚡',
        xpReward: 1000,
        unlocked: false,
        rarity: 'legendary',
        blockchainVerified: true,
      },
      {
        id: 'blockchain_expert',
        name: 'Blockchain Expert',
        description: 'Completed 10 advanced blockchain courses',
        icon: '⛓️',
        xpReward: 2000,
        unlocked: false,
        rarity: 'mythic',
        blockchainVerified: true,
      },
    ];
  }

  private static async checkAchievements(
    userId: string,
    actionType: string,
    totalXP: number
  ): Promise<void> {
    const userXP = this.getUserXP(userId);
    let achievementUnlocked = false;

    // Check each achievement condition
    for (const achievement of userXP.achievements) {
      if (!achievement.unlocked) {
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_login':
            shouldUnlock = actionType === 'daily_login';
            break;
          case 'first_quiz':
            shouldUnlock = actionType === 'quiz_completion';
            break;
          case 'first_lesson':
            shouldUnlock = actionType === 'lesson_completion';
            break;
          case 'quiz_master':
            shouldUnlock = userXP.transactions.filter(t => t.type === 'quiz_completion').length >= 5;
            break;
          case 'course_creator':
            shouldUnlock = actionType === 'course_completion';
            break;
          case 'streak_master':
            shouldUnlock = this.checkStreakAchievement(userId);
            break;
          case 'web3_pioneer':
            shouldUnlock = userXP.transactions.filter(t => t.reason.includes('blockchain')).length >= 3;
            break;
          case 'move_master':
            shouldUnlock = userXP.transactions.filter(t => t.reason.includes('Move')).length >= 5;
            break;
          case 'blockchain_expert':
            shouldUnlock = userXP.transactions.filter(t => t.reason.includes('blockchain')).length >= 10;
            break;
        }

        if (shouldUnlock) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();

          // Award achievement XP
          await this.awardXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`, 'achievement');

          // Mint NFT for achievement (simulate)
          await this.mintAchievementNFT(userId, achievement);

          achievementUnlocked = true;
        }
      }
    }

    if (achievementUnlocked) {
      this.saveUserXP(userId, userXP);
    }
  }

  private static checkStreakAchievement(userId: string): boolean {
    // Simplified streak check - in real app, this would track daily logins
    const userXP = this.getUserXP(userId);
    const loginTransactions = userXP.transactions.filter(t => t.type === 'daily_login');
    return loginTransactions.length >= 7;
  }

  private static async mintAchievementNFT(userId: string, achievement: Achievement): Promise<void> {
    const nft: NFT = {
      id: `nft_${achievement.id}_${Date.now()}`,
      name: `${achievement.name} NFT`,
      description: achievement.description,
      image: `https://educhain.io/nft/${achievement.id}.png`,
      achievement: achievement.name,
      rarity: achievement.rarity,
      mintedAt: Date.now(),
      contractAddress: '0x1::educhain::CompletionNFT', // Mock contract address
      tokenId: `token_${Date.now()}`,
    };

    const userXP = this.getUserXP(userId);
    userXP.nfts.push(nft);
    this.saveUserXP(userId, userXP);
  }

  private static saveUserXP(userId: string, userXP: UserXP): void {
    localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(userXP));
  }

  // Pre-populate demo data for showcase
  static async initializeDemoData(userId: string = 'demo_user'): Promise<void> {
    const demoTransactions: XPTransaction[] = [
      {
        id: 'demo_1',
        amount: 25,
        reason: 'Welcome bonus for joining EduChain',
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        type: 'bonus',
        blockchainVerified: true,
        txHash: '0x1234567890abcdef',
      },
      {
        id: 'demo_2',
        amount: 50,
        reason: 'Completed Sui Move Fundamentals Quiz',
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        type: 'quiz_completion',
        blockchainVerified: true,
        txHash: '0xabcdef1234567890',
      },
      {
        id: 'demo_3',
        amount: 75,
        reason: 'Completed first lesson: Introduction to Move',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        type: 'lesson_completion',
        blockchainVerified: true,
        txHash: '0x7890123456abcdef',
      },
      {
        id: 'demo_4',
        amount: 200,
        reason: 'Course completed: Sui Move Fundamentals',
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        type: 'course_completion',
        blockchainVerified: true,
        txHash: '0xdef0123456789abc',
      },
      {
        id: 'demo_5',
        amount: 10,
        reason: 'Daily login streak bonus',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: 'daily_login',
        blockchainVerified: true,
        txHash: '0x4567890123abcdef',
      },
    ];

    const demoUserXP: UserXP = {
      totalXP: demoTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      currentLevel: this.calculateLevel(demoTransactions.reduce((sum, tx) => sum + tx.amount, 0)),
      availableXP: demoTransactions.reduce((sum, tx) => sum + tx.amount, 0),
      nextLevelXP: this.getNextLevelXP(this.calculateLevel(demoTransactions.reduce((sum, tx) => sum + tx.amount, 0))),
      transactions: demoTransactions,
      achievements: this.getDefaultAchievements().map(achievement => ({
        ...achievement,
        unlocked: ['first_login', 'first_quiz', 'first_lesson'].includes(achievement.id),
        unlockedAt: achievement.id === 'first_login' ? Date.now() - 7 * 24 * 60 * 60 * 1000 :
                  achievement.id === 'first_quiz' ? Date.now() - 6 * 24 * 60 * 60 * 1000 :
                  achievement.id === 'first_lesson' ? Date.now() - 5 * 24 * 60 * 60 * 1000 : undefined,
      })),
      nfts: [
        {
          id: 'nft_first_quiz',
          name: 'Knowledge Seeker NFT',
          description: 'Awarded for completing your first enrollment quiz',
          image: 'https://educhain.io/nft/knowledge_seeker.png',
          achievement: 'Knowledge Seeker',
          rarity: 'common',
          mintedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
          contractAddress: '0x1::educhain::CompletionNFT',
          tokenId: 'token_001',
        },
        {
          id: 'nft_course_completion',
          name: 'Course Completion NFT',
          description: 'Successfully completed Sui Move Fundamentals course',
          image: 'https://educhain.io/nft/course_completion.png',
          achievement: 'Course Completion',
          rarity: 'rare',
          mintedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
          contractAddress: '0x1::educhain::CompletionNFT',
          tokenId: 'token_002',
        },
      ],
    };

    this.saveUserXP(userId, demoUserXP);
  }

  // Get leaderboard data (mock)
  static async getLeaderboard(): Promise<Array<{ userId: string; totalXP: number; level: number; achievements: number }>> {
    return [
      { userId: 'alice_sui', totalXP: 2840, level: 4, achievements: 8 },
      { userId: 'bob_move', totalXP: 2650, level: 4, achievements: 7 },
      { userId: 'charlie_web3', totalXP: 2390, level: 3, achievements: 6 },
      { userId: 'demo_user', totalXP: 360, level: 2, achievements: 3 },
    ];
  }
}

export default XPService;