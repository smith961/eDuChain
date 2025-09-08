const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(walletAddress: string, username?: string, email?: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, username, email }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updates: { username?: string; email?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Course methods
  async getPublishedCourses() {
    return this.request('/courses/published');
  }

  async getCourseById(id: string) {
    return this.request(`/courses/${id}`);
  }

  async syncCourseFromBlockchain(courseData: any) {
    return this.request('/courses/sync', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  // Enrollment methods (to be implemented)
  async getEnrollments() {
    return this.request('/enrollments');
  }

  async enrollInCourse(courseId: string) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  // Progress methods (to be implemented)
  async getProgress() {
    return this.request('/progress');
  }

  async updateProgress(enrollmentId: string, lessonId: string, progress: number) {
    return this.request('/progress/update', {
      method: 'POST',
      body: JSON.stringify({ enrollmentId, lessonId, progress }),
    });
  }

  // Quiz methods (to be implemented)
  async getQuizzes(courseId: string) {
    return this.request(`/quizzes?courseId=${courseId}`);
  }

  async submitQuiz(quizId: string, answers: any[]) {
    return this.request('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers }),
    });
  }
}

export const apiService = new ApiService();