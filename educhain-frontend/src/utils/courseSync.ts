import { frontendAuthService } from '../services/api';
import { useSuiClient } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui/client';
import { courseStorage } from './courseStorage';

export interface BlockchainCourse {
  id: string;
  title: string;
  description: string;
  instructorAddress: string;
  category: string;
  difficultyLevel: number;
  estimatedDuration: number;
  totalXpReward: number;
  isPublished: boolean;
  createdAt: string;
}

export class CourseSyncService {
  private suiClient: any;

  constructor(suiClient: any) {
    this.suiClient = suiClient;
  }

  async syncPublishedCourses(): Promise<void> {
    try {
      console.log('🔄 Starting course sync from blockchain...');

      // Get all published courses from blockchain
      const publishedCourses = await this.fetchPublishedCoursesFromBlockchain();

      console.log(`📚 Found ${publishedCourses.length} published courses on blockchain`);

      // Store each course locally
      for (const course of publishedCourses) {
        try {
          await courseStorage.saveCourse({
            id: course.id,
            title: course.title,
            description: course.description,
            instructor: course.instructorAddress,
            category: course.category,
            difficulty_level: course.difficultyLevel,
            estimated_duration: course.estimatedDuration,
            objectId: course.id,
            createdAt: course.createdAt,
            isPublished: course.isPublished,
          });
          console.log(`✅ Stored course locally: ${course.title}`);
        } catch (error) {
          console.error(`❌ Failed to store course ${course.id}:`, error);
        }
      }

      console.log('🎉 Course sync completed');
    } catch (error) {
      console.error('❌ Course sync failed:', error);
      throw error;
    }
  }

  private async fetchPublishedCoursesFromBlockchain(): Promise<BlockchainCourse[]> {
    // This is a simplified version - in reality you'd need to:
    // 1. Query the registry for all course IDs
    // 2. Fetch each course object
    // 3. Filter for published courses

    // For now, return empty array - this would be implemented based on your Move contract
    console.log('⚠️ Blockchain course fetching not yet implemented');
    console.log('📝 TODO: Implement blockchain course querying based on your Move contract structure');

    return [];
  }

  async syncSingleCourse(courseId: string): Promise<BlockchainCourse | null> {
    try {
      console.log(`🔄 Syncing single course: ${courseId}`);

      // Fetch course from blockchain
      const obj = await this.suiClient.getObject({
        id: courseId,
        options: {
          showType: true,
          showContent: true,
          showDisplay: true,
        },
      });

      const data = obj.data as SuiObjectData;
      const content = data.content as any;

      if (!content?.fields) {
        throw new Error('Invalid course data structure');
      }

      const fields = content.fields;

      const course: BlockchainCourse = {
        id: courseId,
        title: fields.title || 'Untitled Course',
        description: fields.description || 'No description',
        instructorAddress: fields.instructor || '',
        category: fields.category || 'General',
        difficultyLevel: fields.difficulty_level || 1,
        estimatedDuration: fields.estimated_duration || 0,
        totalXpReward: fields.total_xp_reward || 0,
        isPublished: fields.is_published || false,
        createdAt: fields.created_at || new Date().toISOString(),
      };

      // Store locally
      await courseStorage.saveCourse({
        id: courseId,
        title: course.title,
        description: course.description,
        instructor: course.instructorAddress,
        category: course.category,
        difficulty_level: course.difficultyLevel,
        estimated_duration: course.estimatedDuration,
        objectId: courseId,
        createdAt: course.createdAt,
        isPublished: course.isPublished,
      });

      console.log(`✅ Synced course: ${course.title}`);
      return course;
    } catch (error) {
      console.error(`❌ Failed to sync course ${courseId}:`, error);
      return null;
    }
  }
}

// React hook for course sync
export const useCourseSync = () => {
  const suiClient = useSuiClient();

  const syncService = new CourseSyncService(suiClient);

  return {
    syncAllCourses: () => syncService.syncPublishedCourses(),
    syncSingleCourse: (courseId: string) => syncService.syncSingleCourse(courseId),
  };
};