interface StoredCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty_level: number;
  estimated_duration: number;
  objectId: string;
  createdAt: string;
  isPublished: boolean;
}

class CourseStorage {
  private dbName = 'EduChainCourses';
  private version = 1;

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create courses store
        if (!db.objectStoreNames.contains('courses')) {
          const courseStore = db.createObjectStore('courses', { keyPath: 'objectId' });
          courseStore.createIndex('createdAt', 'createdAt', { unique: false });
          courseStore.createIndex('isPublished', 'isPublished', { unique: false });
        }

        // Create published courses store
        if (!db.objectStoreNames.contains('publishedCourses')) {
          db.createObjectStore('publishedCourses', { keyPath: 'objectId' });
        }
      };
    });
  }

  async saveCourse(course: StoredCourse): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['courses'], 'readwrite');
      const store = transaction.objectStore('courses');
      const request = store.put(course);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCourses(): Promise<StoredCourse[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['courses'], 'readonly');
      const store = transaction.objectStore('courses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async publishCourse(courseId: string): Promise<void> {
    const db = await this.openDB();
    return new Promise(async (resolve, reject) => {
      try {
        // Get course from courses store
        const transaction = db.transaction(['courses', 'publishedCourses'], 'readwrite');
        const courseStore = transaction.objectStore('courses');
        const publishedStore = transaction.objectStore('publishedCourses');

        const courseRequest = courseStore.get(courseId);

        courseRequest.onsuccess = () => {
          const course = courseRequest.result;
          if (course) {
            // Update course as published
            course.isPublished = true;
            courseStore.put(course);

            // Add to published courses
            publishedStore.put(course);
          }
          resolve();
        };

        courseRequest.onerror = () => reject(courseRequest.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPublishedCourses(): Promise<StoredCourse[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['publishedCourses'], 'readonly');
      const store = transaction.objectStore('publishedCourses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['courses', 'publishedCourses'], 'readwrite');

      const courseStore = transaction.objectStore('courses');
      const publishedStore = transaction.objectStore('publishedCourses');

      courseStore.clear();
      publishedStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const courseStorage = new CourseStorage();