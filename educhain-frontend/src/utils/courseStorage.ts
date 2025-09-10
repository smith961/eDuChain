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
  private storageKey = 'educhain_courses';
  private publishedKey = 'educhain_published_courses';

  async saveCourse(course: StoredCourse): Promise<void> {
    try {
      console.log('CourseStorage: Saving course:', course);
      const existingCourses = this.getAllCoursesSync();
      const updatedCourses = [...existingCourses.filter((c: any) => c.objectId !== course.objectId), course];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedCourses));
      console.log('CourseStorage: Course saved successfully');
    } catch (error) {
      console.error('CourseStorage: Failed to save course:', error);
      throw error;
    }
  }

  async getAllCourses(): Promise<StoredCourse[]> {
    try {
      console.log('CourseStorage: Loading courses from localStorage');
      const courses = this.getAllCoursesSync();
      console.log('CourseStorage: Loaded courses:', courses);
      return courses;
    } catch (error) {
      console.error('CourseStorage: Failed to load courses:', error);
      return [];
    }
  }

  private getAllCoursesSync(): StoredCourse[] {
    try {
      const courses = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return courses;
    } catch (error) {
      console.error('CourseStorage: Failed to parse courses:', error);
      return [];
    }
  }

  async publishCourse(courseId: string): Promise<void> {
    try {
      console.log('CourseStorage: Publishing course:', courseId);
      const courses = this.getAllCoursesSync();
      const courseIndex = courses.findIndex(c => c.objectId === courseId);

      if (courseIndex !== -1) {
        courses[courseIndex].isPublished = true;
        localStorage.setItem(this.storageKey, JSON.stringify(courses));

        // Add to published courses
        const publishedCourses = this.getPublishedCoursesSync();
        const updatedPublished = [...publishedCourses.filter(c => c.objectId !== courseId), courses[courseIndex]];
        localStorage.setItem(this.publishedKey, JSON.stringify(updatedPublished));

        console.log('CourseStorage: Course published successfully');
      } else {
        throw new Error('Course not found');
      }
    } catch (error) {
      console.error('CourseStorage: Failed to publish course:', error);
      throw error;
    }
  }

  async getPublishedCourses(): Promise<StoredCourse[]> {
    try {
      console.log('CourseStorage: Loading published courses');
      const courses = this.getPublishedCoursesSync();
      console.log('CourseStorage: Loaded published courses:', courses);
      return courses;
    } catch (error) {
      console.error('CourseStorage: Failed to load published courses:', error);
      return [];
    }
  }

  private getPublishedCoursesSync(): StoredCourse[] {
    try {
      const courses = JSON.parse(localStorage.getItem(this.publishedKey) || '[]');
      return courses;
    } catch (error) {
      console.error('CourseStorage: Failed to parse published courses:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.publishedKey);
      console.log('CourseStorage: All data cleared');
    } catch (error) {
      console.error('CourseStorage: Failed to clear data:', error);
      throw error;
    }
  }

  // Debug method to check current storage state
  async debugStorage(): Promise<void> {
    console.log('=== CourseStorage Debug ===');

    try {
      const courses = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      console.log('localStorage courses:', courses);
    } catch (error) {
      console.error('localStorage debug error:', error);
    }

    try {
      const publishedCourses = JSON.parse(localStorage.getItem(this.publishedKey) || '[]');
      console.log('localStorage published courses:', publishedCourses);
    } catch (error) {
      console.error('localStorage published debug error:', error);
    }

    console.log('=== End Debug ===');
  }
}

export const courseStorage = new CourseStorage();