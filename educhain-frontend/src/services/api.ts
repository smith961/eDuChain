// Frontend-only service - No backend API calls
// All data is stored locally or on blockchain

import XPService from './xpService';

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  totalXP: number;
  currentLevel: number;
  createdAt: number;
  lastLogin: number;
}

class FrontendAuthService {
  private static readonly USER_KEY = 'educhain_user_profile';

  // Authentication methods - Local storage only
  static login(walletAddress: string, username?: string, email?: string): UserProfile {
    // Create or update user profile
    const existingProfile = this.getStoredProfile(walletAddress);

    const profile: UserProfile = {
      id: walletAddress,
      walletAddress,
      username: username || existingProfile?.username,
      email: email || existingProfile?.email,
      totalXP: existingProfile?.totalXP || 0,
      currentLevel: existingProfile?.currentLevel || 1,
      createdAt: existingProfile?.createdAt || Date.now(),
      lastLogin: Date.now(),
    };

    // Store profile
    localStorage.setItem(`${this.USER_KEY}_${walletAddress}`, JSON.stringify(profile));

    // Award daily login XP if applicable
    this.awardDailyLoginXP(walletAddress);

    return profile;
  }

  static getProfile(walletAddress: string): UserProfile | null {
    return this.getStoredProfile(walletAddress);
  }

  static updateProfile(walletAddress: string, updates: { username?: string; email?: string }): UserProfile {
    const profile = this.getStoredProfile(walletAddress);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = { ...profile, ...updates };
    localStorage.setItem(`${this.USER_KEY}_${walletAddress}`, JSON.stringify(updatedProfile));

    return updatedProfile;
  }

  static logout(walletAddress: string): void {
    // Clear user-specific data but keep profile
    const profile = this.getStoredProfile(walletAddress);
    if (profile) {
      profile.lastLogin = Date.now();
      localStorage.setItem(`${this.USER_KEY}_${walletAddress}`, JSON.stringify(profile));
    }
  }

  // Course methods - Local storage only
  static getPublishedCourses() {
    // Get courses from local storage (created by admin/course creators)
    const courses = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('educhain_course_')) {
        try {
          const course = JSON.parse(localStorage.getItem(key)!);
          if (course.isPublished) {
            courses.push(course);
          }
        } catch (e) {
          // Skip invalid data
        }
      }
    }
    return courses;
  }

  static getCourseById(id: string) {
    const courseData = localStorage.getItem(`educhain_course_${id}`);
    return courseData ? JSON.parse(courseData) : null;
  }

  // Enrollment methods - Local storage only
  static getEnrollments(walletAddress: string) {
    const enrollments = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`educhain_enrollment_${walletAddress}_`)) {
        try {
          const enrollment = JSON.parse(localStorage.getItem(key)!);
          enrollments.push(enrollment);
        } catch (e) {
          // Skip invalid data
        }
      }
    }
    return enrollments;
  }

  static enrollInCourse(walletAddress: string, courseId: string) {
    const enrollment = {
      id: `enrollment_${Date.now()}`,
      userId: walletAddress,
      courseId,
      enrolledAt: Date.now(),
      progress: 0,
      completedLessons: [],
    };

    localStorage.setItem(`educhain_enrollment_${walletAddress}_${courseId}`, JSON.stringify(enrollment));
    return enrollment;
  }

  // Progress methods - Local storage only
  static getProgress(walletAddress: string) {
    return this.getEnrollments(walletAddress);
  }

  static updateProgress(walletAddress: string, courseId: string, lessonId: string, progress: number) {
    const enrollmentKey = `educhain_enrollment_${walletAddress}_${courseId}`;
    const enrollmentData = localStorage.getItem(enrollmentKey);

    if (enrollmentData) {
      const enrollment = JSON.parse(enrollmentData);
      enrollment.progress = progress;

      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }

      localStorage.setItem(enrollmentKey, JSON.stringify(enrollment));
      return enrollment;
    }

    return null;
  }

  // Quiz methods - Local storage only
  static getQuizzes(courseId: string) {
    const quizzes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('educhain_quiz_')) {
        try {
          const quiz = JSON.parse(localStorage.getItem(key)!);
          if (quiz.courseId === courseId && quiz.isActive) {
            quizzes.push(quiz);
          }
        } catch (e) {
          // Skip invalid data
        }
      }
    }
    return quizzes;
  }

  static submitQuiz(walletAddress: string, quizId: string, answers: any[]) {
    // This is handled by QuizService now
    // Just return a mock response for compatibility
    return {
      success: true,
      message: 'Quiz submitted successfully',
    };
  }

  // Helper methods
  private static getStoredProfile(walletAddress: string): UserProfile | null {
    const profileData = localStorage.getItem(`${this.USER_KEY}_${walletAddress}`);
    return profileData ? JSON.parse(profileData) : null;
  }

  private static async awardDailyLoginXP(walletAddress: string): Promise<void> {
    try {
      const profile = this.getStoredProfile(walletAddress);
      if (profile) {
        // Check if it's been more than 24 hours since last login
        const hoursSinceLastLogin = (Date.now() - profile.lastLogin) / (1000 * 60 * 60);

        if (hoursSinceLastLogin >= 24) {
          await XPService.awardXP(walletAddress, 10, 'Daily login bonus', 'daily_login');
        }
      }
    } catch (error) {
      console.warn('Failed to award daily login XP:', error);
    }
  }
}

export const frontendAuthService = FrontendAuthService;