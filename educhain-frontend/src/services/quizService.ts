import ConfigService, { QuizConfig, QuizQuestion } from './configService';
import XPService from './xpService';
import { suiClient } from './blockchainService';

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: (string | number)[];
  score: number;
  passed: boolean;
  timeSpent: number; // in seconds
  attemptedAt: number;
  blockchainVerified: boolean;
  txHash?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  passed: boolean;
  xpEarned: number;
  timeSpent: number;
  feedback: string;
  nextRecommendedQuizzes: string[];
}

class QuizService {
  private static readonly STORAGE_KEY = 'educhain_quizzes';
  private static readonly ATTEMPTS_KEY = 'educhain_quiz_attempts';

  // Default quizzes
  private static readonly DEFAULT_QUIZZES: QuizConfig[] = [
    {
      id: 'sui-move-basics',
      title: 'Sui Move Fundamentals',
      description: 'Test your understanding of basic Sui Move concepts',
      courseId: 'sui-move-intro',
      passingScore: 70,
      maxAttempts: 3,
      timeLimit: 30,
      xpReward: 100,
      difficulty: 'beginner',
      tags: ['sui', 'move', 'blockchain', 'basics'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of Move programming language?',
          type: 'multiple_choice',
          options: [
            'Web development',
            'Blockchain smart contracts',
            'Mobile app development',
            'Data analysis'
          ],
          correctAnswer: 1,
          explanation: 'Move was designed specifically for blockchain smart contracts with safety and security in mind.',
          points: 10,
          difficulty: 'easy',
        },
        {
          id: 'q2',
          question: 'Which of these is a key feature of Move that prevents common programming errors?',
          type: 'multiple_choice',
          options: [
            'Dynamic typing',
            'Resource-oriented design',
            'Garbage collection',
            'Multi-threading'
          ],
          correctAnswer: 1,
          explanation: 'Move\'s resource-oriented design treats digital assets as resources that cannot be copied or implicitly discarded.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'q3',
          question: 'In Sui Move, what does the \'key\' ability allow a struct to do?',
          type: 'multiple_choice',
          options: [
            'Be copied freely',
            'Be used as a key in global storage',
            'Be automatically deleted',
            'Store multiple values'
          ],
          correctAnswer: 1,
          explanation: 'The \'key\' ability allows a struct to be used as a key in Sui\'s global storage system.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'q4',
          question: 'What is the difference between Sui Move and other Move implementations?',
          type: 'multiple_choice',
          options: [
            'Sui uses an account-based model',
            'Sui uses an object-based model',
            'Sui doesn\'t support smart contracts',
            'Sui uses JavaScript instead of Move'
          ],
          correctAnswer: 1,
          explanation: 'Sui uses an innovative object-based model instead of the traditional account-based model used in other Move implementations.',
          points: 20,
          difficulty: 'hard',
        },
        {
          id: 'q5',
          question: 'Which Sui-specific feature allows flexible key-value storage on objects?',
          type: 'multiple_choice',
          options: [
            'Shared Objects',
            'Dynamic Fields',
            'Generic Types',
            'Error Handling'
          ],
          correctAnswer: 1,
          explanation: 'Dynamic Fields provide flexible key-value storage capabilities on Sui objects.',
          points: 20,
          difficulty: 'hard',
        },
        {
          id: 'q6',
          question: 'True or False: In Sui, objects can be owned by addresses or other objects.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'Yes, Sui\'s object-based model allows objects to be owned by addresses or other objects, creating complex ownership hierarchies.',
          points: 10,
          difficulty: 'easy',
        },
        {
          id: 'q7',
          question: 'What is the maximum number of attempts allowed for this quiz?',
          type: 'short_answer',
          correctAnswer: '3',
          explanation: 'This quiz allows a maximum of 3 attempts before requiring instructor review.',
          points: 10,
          difficulty: 'easy',
        }
      ]
    },
    {
      id: 'java-basics-quiz',
      title: 'Java Programming Fundamentals',
      description: 'Assess your knowledge of core Java concepts',
      courseId: 'java-basics',
      passingScore: 75,
      maxAttempts: 5,
      timeLimit: 45,
      xpReward: 120,
      difficulty: 'beginner',
      tags: ['java', 'programming', 'oop', 'basics'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
      questions: [
        {
          id: 'java_q1',
          question: 'What is the main difference between Java and JavaScript?',
          type: 'multiple_choice',
          options: [
            'Java is compiled, JavaScript is interpreted',
            'Java runs on servers, JavaScript runs in browsers',
            'Java is object-oriented, JavaScript is functional',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Java is a compiled, object-oriented language that can run on servers, while JavaScript is an interpreted language primarily used in web browsers.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'java_q2',
          question: 'Which of these is the correct way to declare a variable in Java?',
          type: 'multiple_choice',
          options: [
            'var myVar = 5;',
            'let myVar = 5;',
            'int myVar = 5;',
            'const myVar = 5;'
          ],
          correctAnswer: 2,
          explanation: 'In Java, you declare variables with a type followed by the variable name, like \'int myVar = 5;\' for integer variables.',
          points: 10,
          difficulty: 'easy',
        },
        {
          id: 'java_q3',
          question: 'What does JVM stand for in Java?',
          type: 'multiple_choice',
          options: [
            'Java Virtual Machine',
            'Java Variable Manager',
            'JavaScript Virtual Machine',
            'Just Virtual Memory'
          ],
          correctAnswer: 0,
          explanation: 'JVM stands for Java Virtual Machine, which is responsible for executing Java bytecode on any platform.',
          points: 10,
          difficulty: 'easy',
        },
        {
          id: 'java_q4',
          question: 'Which of these is NOT a primitive data type in Java?',
          type: 'multiple_choice',
          options: [
            'int',
            'boolean',
            'String',
            'double'
          ],
          correctAnswer: 2,
          explanation: 'String is not a primitive data type in Java - it\'s a class/object. Primitive types include int, boolean, double, char, etc.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'java_q5',
          question: 'What is the purpose of the \'public static void main(String[] args)\' method in Java?',
          type: 'multiple_choice',
          options: [
            'To create objects',
            'To define variables',
            'To start program execution',
            'To handle exceptions'
          ],
          correctAnswer: 2,
          explanation: 'The main method is the entry point of any Java program - it\'s where program execution begins.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'java_q6',
          question: 'True or False: Java supports multiple inheritance through classes.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'False. Java does not support multiple inheritance through classes, but it does support it through interfaces.',
          points: 15,
          difficulty: 'medium',
        },
        {
          id: 'java_q7',
          question: 'Write a simple Java method that returns the sum of two integers.',
          type: 'code',
          correctAnswer: 'public int sum(int a, int b) { return a + b; }',
          explanation: 'This is a basic method declaration in Java that takes two integer parameters and returns their sum.',
          points: 20,
          difficulty: 'hard',
          hints: ['Use the method signature: public int methodName(parameters)', 'Use the return keyword to return the result']
        }
      ]
    }
  ];

  // Get all quizzes
  static getQuizzes(): QuizConfig[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.DEFAULT_QUIZZES;
  }

  // Get quiz by ID
  static getQuizById(quizId: string): QuizConfig | undefined {
    return this.getQuizzes().find(quiz => quiz.id === quizId && quiz.isActive);
  }

  // Get quizzes by course ID
  static getQuizzesByCourse(courseId: string): QuizConfig[] {
    return this.getQuizzes().filter(quiz => quiz.courseId === courseId && quiz.isActive);
  }

  // Get quizzes by tags
  static getQuizzesByTags(tags: string[]): QuizConfig[] {
    return this.getQuizzes().filter(quiz =>
      quiz.isActive &&
      tags.some(tag => quiz.tags.includes(tag))
    );
  }

  // Create new quiz
  static createQuiz(quizData: Omit<QuizConfig, 'id' | 'createdAt' | 'updatedAt'>): QuizConfig {
    const newQuiz: QuizConfig = {
      ...quizData,
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const quizzes = this.getQuizzes();
    quizzes.push(newQuiz);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quizzes));

    return newQuiz;
  }

  // Update quiz
  static updateQuiz(quizId: string, updates: Partial<QuizConfig>): void {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(quiz => quiz.id === quizId);
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...updates, updatedAt: Date.now() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quizzes));
    }
  }

  // Delete quiz
  static deleteQuiz(quizId: string): void {
    const quizzes = this.getQuizzes().filter(quiz => quiz.id !== quizId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quizzes));
  }

  // Submit quiz attempt
  static async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: (string | number)[],
    timeSpent: number
  ): Promise<QuizResult> {
    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check attempt limit
    const attempts = this.getUserAttempts(userId, quizId);
    if (attempts.length >= quiz.maxAttempts) {
      throw new Error('Maximum attempts exceeded');
    }

    // Calculate score
    const score = this.calculateScore(quiz, answers);
    const passed = score >= quiz.passingScore;

    // Create attempt record
    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      quizId,
      answers,
      score,
      passed,
      timeSpent,
      attemptedAt: Date.now(),
      blockchainVerified: false,
    };

    // Save attempt
    this.saveAttempt(attempt);

    // Award XP if passed
    let xpEarned = 0;
    if (passed) {
      // Calculate XP based on difficulty and performance
      xpEarned = this.calculateQuizXP(quiz, score, timeSpent);
      await XPService.awardXP(userId, xpEarned, `Passed quiz: ${quiz.title}`, 'quiz_completion');

      // Try to record on blockchain
      try {
        // This would integrate with blockchain service
        // await this.recordQuizResultOnChain(userId, quizId, score, xpEarned);
        attempt.blockchainVerified = true;
        attempt.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      } catch (error) {
        console.warn('Failed to record quiz result on blockchain:', error);
      }
    }

    // Generate feedback
    const feedback = this.generateFeedback(quiz, score, passed);

    // Get next recommended quizzes
    const nextRecommendedQuizzes = this.getRecommendedQuizzes(userId, quiz);

    return {
      quizId,
      score,
      passed,
      xpEarned,
      timeSpent,
      feedback,
      nextRecommendedQuizzes,
    };
  }

  // Calculate quiz score
  private static calculateScore(quiz: QuizConfig, answers: (string | number)[]): number {
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      const userAnswer = answers[index];

      if (this.isCorrectAnswer(question, userAnswer)) {
        earnedPoints += question.points;
      }
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  }

  // Check if answer is correct
  private static isCorrectAnswer(question: QuizQuestion, userAnswer: string | number): boolean {
    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correctAnswer;
      case 'true_false':
        return userAnswer === question.correctAnswer;
      case 'short_answer':
        return typeof question.correctAnswer === 'string' &&
               userAnswer.toString().toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      case 'code':
        // Simple code comparison - in real app, this would be more sophisticated
        return userAnswer.toString().toLowerCase().replace(/\s+/g, '') ===
               question.correctAnswer.toString().toLowerCase().replace(/\s+/g, '');
      default:
        return false;
    }
  }

  // Calculate XP for quiz completion
  private static calculateQuizXP(quiz: QuizConfig, score: number, timeSpent: number): number {
    const baseXP = quiz.xpReward;

    // Difficulty multiplier
    let difficultyMultiplier = 1;
    switch (quiz.difficulty) {
      case 'beginner': difficultyMultiplier = 0.8; break;
      case 'intermediate': difficultyMultiplier = 1; break;
      case 'advanced': difficultyMultiplier = 1.3; break;
      case 'expert': difficultyMultiplier = 1.6; break;
    }

    // Performance bonus
    const performanceBonus = score >= 90 ? 1.2 : score >= 80 ? 1.1 : 1;

    // Time bonus (faster completion = more XP, but not too fast)
    const optimalTime = quiz.timeLimit ? quiz.timeLimit * 60 : 1800; // default 30 minutes
    const timeRatio = timeSpent / optimalTime;
    const timeBonus = timeRatio > 0.3 && timeRatio < 1.5 ? 1.1 : 1;

    return Math.round(baseXP * difficultyMultiplier * performanceBonus * timeBonus);
  }

  // Generate feedback for quiz result
  private static generateFeedback(quiz: QuizConfig, score: number, passed: boolean): string {
    if (passed) {
      if (score >= 90) {
        return `🎉 Excellent! You mastered this quiz with a ${score}%. You're ready for advanced topics!`;
      } else if (score >= 80) {
        return `👏 Great job! You passed with a ${score}%. Keep up the good work!`;
      } else {
        return `✅ Well done! You passed with a ${score}%. Consider reviewing the material for better understanding.`;
      }
    } else {
      if (score >= 50) {
        return `📚 Almost there! You scored ${score}%, just ${quiz.passingScore - score}% away from passing. Try again!`;
      } else {
        return `📖 Keep studying! You scored ${score}%. Review the material and try again when you're ready.`;
      }
    }
  }

  // Get recommended next quizzes
  private static getRecommendedQuizzes(userId: string, currentQuiz: QuizConfig): string[] {
    const allQuizzes = this.getQuizzes();
    const userAttempts = this.getUserAttempts(userId);

    // Find quizzes user hasn't attempted or failed
    const unattemptedOrFailed = allQuizzes.filter(quiz => {
      const attempts = userAttempts.filter(a => a.quizId === quiz.id);
      return attempts.length === 0 || !attempts.some(a => a.passed);
    });

    // Prioritize by difficulty progression
    const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentDifficultyIndex = difficultyOrder.indexOf(currentQuiz.difficulty);

    return unattemptedOrFailed
      .filter(quiz => {
        const quizDifficultyIndex = difficultyOrder.indexOf(quiz.difficulty);
        return Math.abs(quizDifficultyIndex - currentDifficultyIndex) <= 1;
      })
      .sort((a, b) => {
        const aIndex = difficultyOrder.indexOf(a.difficulty);
        const bIndex = difficultyOrder.indexOf(b.difficulty);
        return aIndex - bIndex;
      })
      .slice(0, 3)
      .map(quiz => quiz.id);
  }

  // Get user attempts for a quiz
  static getUserAttempts(userId: string, quizId?: string): QuizAttempt[] {
    const stored = localStorage.getItem(`${this.ATTEMPTS_KEY}_${userId}`);
    const allAttempts: QuizAttempt[] = stored ? JSON.parse(stored) : [];

    return quizId ? allAttempts.filter(attempt => attempt.quizId === quizId) : allAttempts;
  }

  // Save attempt
  private static saveAttempt(attempt: QuizAttempt): void {
    const attempts = this.getUserAttempts(attempt.userId);
    attempts.push(attempt);
    localStorage.setItem(`${this.ATTEMPTS_KEY}_${attempt.userId}`, JSON.stringify(attempts));
  }

  // Get quiz statistics
  static getQuizStats(quizId: string): {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    averageTime: number;
  } {
    // Get all stored attempts from all users
    const allUserKeys = Object.keys(localStorage).filter(key =>
      key.startsWith(`${this.ATTEMPTS_KEY}_`)
    );

    const allAttempts: QuizAttempt[] = [];
    allUserKeys.forEach(key => {
      const userId = key.replace(`${this.ATTEMPTS_KEY}_`, '');
      const userAttempts = this.getUserAttempts(userId, quizId);
      allAttempts.push(...userAttempts);
    });

    if (allAttempts.length === 0) {
      return { totalAttempts: 0, averageScore: 0, passRate: 0, averageTime: 0 };
    }

    const totalAttempts = allAttempts.length;
    const averageScore = allAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts;
    const passRate = (allAttempts.filter(a => a.passed).length / totalAttempts) * 100;
    const averageTime = allAttempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts;

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      averageTime: Math.round(averageTime),
    };
  }

  // Reset user progress for a quiz
  static resetUserProgress(userId: string, quizId: string): void {
    const attempts = this.getUserAttempts(userId).filter(a => a.quizId !== quizId);
    localStorage.setItem(`${this.ATTEMPTS_KEY}_${userId}`, JSON.stringify(attempts));
  }

  // Export quiz data
  static exportQuizzes(): any {
    return {
      quizzes: this.getQuizzes(),
      exportedAt: Date.now(),
    };
  }

  // Import quiz data
  static importQuizzes(data: any): void {
    if (data.quizzes) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.quizzes));
    }
  }
}

export default QuizService;