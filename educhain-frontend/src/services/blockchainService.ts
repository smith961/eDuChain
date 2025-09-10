import { SuiClient, getFullnodeUrl} from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

// Create Sui client
export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'), // Using testnet for development and testing
});

// Export Transaction for use in components
export { Transaction };

// Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty_level: number;
  estimated_duration: number;
  objectId: string;
}

// Helper function to get signAndExecute hook
export const useSignAndExecute = () => {
  return useSignAndExecuteTransaction();
};

// Helper function to get package ID from env
export const getPackageId = (): string => {
  const packageId = import.meta.env.VITE_PACKAGE_ID;
  if (!packageId) {
    throw new Error('VITE_PACKAGE_ID not configured in environment variables');
  }
  return packageId;
};

// Helper function to get admin cap ID from env
export const getAdminCapId = (): string => {
  const adminCapId = import.meta.env.VITE_ADMIN_CAP_ID;
  if (!adminCapId) {
    throw new Error('VITE_ADMIN_CAP_ID not configured in environment variables');
  }
  return adminCapId;
};

// Helper function to get registry ID from env
export const getRegistryId = (): string => {
  const registryId = import.meta.env.VITE_EDUCHAINRegistry;
  if (!registryId) {
    throw new Error('VITE_EDUCHAINRegistry not configured in environment variables');
  }
  return registryId;
};

// Helper function to validate Sui address
export const isValidSuiAddress = (address: string): boolean => {
  return /^0x[0-9a-f]{1,64}$/.test(address) && address.length === 66;
};

// Helper function to create course transaction
export const createCourseTransaction = (
  title: string,
  description: string,
  instructor: string,
  category: string,
  difficultyLevel: number,
  estimatedDuration: number
): Transaction => {
  const tx = new Transaction();
  const packageId = getPackageId();
  const registryId = getRegistryId();

  const clock = tx.sharedObjectRef({
    objectId: '0x6', // Fixed Clock object ID
    initialSharedVersion: 1,
    mutable: false,
  });

  tx.moveCall({
    // cspell:disable-next-line
    target: `${packageId}::educhain::create_course`,
    arguments: [
      tx.object(registryId),
      tx.pure.string(title),
      tx.pure.string(description),
      tx.pure.address(instructor),
      tx.pure.string(category),
      tx.pure.u8(difficultyLevel),
      tx.pure.u64(estimatedDuration),
      clock,
    ],
  });

  return tx;
};

// Helper function to add lesson transaction
export const addLessonTransaction = (
  courseId: string,
  title: string,
  contentType: string,
  contentUrl: string,
  duration: number,
  orderIndex: number
): Transaction => {
  const tx = new Transaction();
  const packageId = getPackageId();

  tx.moveCall({
    // cspell:disable-next-line
    target: `${packageId}::educhain::add_lesson`,
    arguments: [
      tx.object(courseId),
      tx.pure.string(title),
      tx.pure.string(contentType),
      tx.pure.string(contentUrl),
      tx.pure.u64(duration),
      tx.pure.u64(orderIndex),
    ],
  });

  return tx;
};

// Helper function to publish course transaction
export const publishCourseTransaction = (courseId: string): Transaction => {
  const tx = new Transaction();
  const packageId = getPackageId();

  tx.moveCall({
    // cspell:disable-next-line
    target: `${packageId}::educhain::publish_course`,
    arguments: [
      tx.object(courseId),
    ],
  });

  return tx;
};

// Helper function to get transaction details
export const getTransactionDetails = async (digest: string) => {
  return await suiClient.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
};

// Helper function to get user profile from blockchain
export const getUserProfile = async (_userAddress: string) => {
  try {
    // This would need to be implemented based on how profiles are stored
    // For now, return mock data structure
    const mockProfile = {
      username: "Blockchain User",
      email: "user@educhain.io",
      total_xp: 1250,
      current_level: 2,
      courses_enrolled: 3,
      lessons_completed: 15,
      nfts_earned: 2,
      last_login: Date.now(),
      login_streak: 5,
      registration_date: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      is_active: true,
    };
    return mockProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Helper function to update user profile on blockchain
export const updateUserProfile = async (_updates: { username?: string; email?: string }) => {
  // This would create a transaction to update the profile on blockchain
  // For now, return a mock transaction
  const mockTx = {
    digest: `0x${Math.random().toString(16).substr(2, 64)}`,
    effects: { status: { status: 'success' } },
  };
  return mockTx;
};

// Helper function to get user achievements from blockchain
export const getUserAchievements = async (_userAddress: string) => {
  try {
    // Mock achievements data
    const mockAchievements = [
      {
        id: 'first_login',
        name: 'Welcome to EduChain',
        description: 'Successfully connected your wallet',
        icon: '👋',
        xpReward: 25,
        unlocked: true,
        unlockedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        rarity: 'common',
        blockchainVerified: true,
      },
      {
        id: 'first_quiz',
        name: 'Knowledge Seeker',
        description: 'Completed your first quiz',
        icon: '🧠',
        xpReward: 50,
        unlocked: true,
        unlockedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        rarity: 'common',
        blockchainVerified: true,
      },
      {
        id: 'first_lesson',
        name: 'Learning Journey Begins',
        description: 'Completed your first lesson',
        icon: '📚',
        xpReward: 75,
        unlocked: true,
        unlockedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        rarity: 'common',
        blockchainVerified: true,
      },
    ];
    return mockAchievements;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
};

// Helper function to get user NFTs from blockchain
export const getUserNFTs = async (_userAddress: string) => {
  try {

    const mockNFTs = [
      {
        id: 'nft_1',
        name: 'Course Completion NFT',
        description: 'Successfully completed Sui Move Fundamentals',
        image: 'https://educhain.io/nft/course_completion.png',
        achievement: 'Course Completion',
        rarity: 'rare',
        mintedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
        // cspell:disable-next-line
        contractAddress: '0x1::educhain::CompletionNFT',
        tokenId: 'token_001',
      },
      {
        id: 'nft_2',
        name: 'Quiz Master NFT',
        description: 'Passed 5 quizzes with perfect scores',
        image: 'https://educhain.io/nft/quiz_master.png',
        achievement: 'Quiz Master',
        rarity: 'epic',
        mintedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        // cspell:disable-next-line
        contractAddress: '0x1::educhain::CompletionNFT',
        tokenId: 'token_002',
      },
    ];
    return mockNFTs;
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return [];
  }
};

// Helper function to get platform stats from blockchain
export const getPlatformStats = async (): Promise<{
  totalUsers: number;
  totalCourses: number;
  totalXpAwarded: number;
}> => {
  const packageId = getPackageId();
  const registryId = getRegistryId();

  try {
    const tx = new Transaction();
    tx.moveCall({
      // cspell:disable-next-line
      target: `${packageId}::educhain::get_platform_stats`,
      arguments: [tx.object(registryId)],
    });

    const result = await suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
    });

    if (result.results && result.results.length > 0) {
      const returnValues = result.results[0].returnValues;
      if (returnValues && returnValues.length >= 3) {
        const totalUsers = Number(returnValues[0][0]);
        const totalCourses = Number(returnValues[1][0]);
        const totalXpAwarded = Number(returnValues[2][0]);

        return {
          totalUsers,
          totalCourses,
          totalXpAwarded,
        };
      }
    }

    throw new Error('Failed to parse platform stats');
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    throw error;
  }
};

// Helper function to get course details from blockchain
export const getCourseFromBlockchain = async (courseId: string) => {
  try {
    const courseObject = await suiClient.getObject({
      id: courseId,
      options: {
        showContent: true,
        showType: true,
      },
    });

    if (courseObject.data?.content?.dataType === 'moveObject') {
      const fields = courseObject.data.content.fields as any;
      return {
        id: courseId,
        title: fields.title,
        description: fields.description,
        instructor: fields.instructor,
        category: fields.category,
        difficulty_level: Number(fields.difficulty_level),
        estimated_duration: Number(fields.estimated_duration),
        isPublished: fields.is_published,
        totalEnrollments: Number(fields.total_enrollments),
        objectId: courseId,
        createdAt: new Date(Number(fields.created_at)).toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching course from blockchain:', error);
    return null;
  }
};

// Helper function to get lessons for a course from blockchain
export const getLessonsForCourse = async (courseId: string) => {
  try {
    console.log('🔍 Searching for lessons for course:', courseId);

    // First, try to get lessons directly from course object (if stored there)
    try {
      const courseObject = await suiClient.getObject({
        id: courseId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (courseObject.data?.content?.dataType === 'moveObject') {
        const fields = courseObject.data.content.fields as any;
        console.log('📊 Course object fields:', fields);

        // Check if lessons exist in the course object
        if (fields.lessons && Array.isArray(fields.lessons)) {
          console.log('✅ Found lessons in course object:', fields.lessons);
          return fields.lessons.map((lesson: any) => ({
            id: lesson.id || `${courseId}_lesson_${lesson.order_index}`,
            title: lesson.title,
            content_type: lesson.content_type,
            content_url: lesson.content_url,
            duration: Number(lesson.duration),
            order_index: Number(lesson.order_index),
          }));
        }
      }
    } catch (courseError) {
      console.log('⚠️ Could not fetch course object directly:', courseError);
    }

    // If lessons not found in course object, try to query for lesson objects
    // This is a fallback for when lessons are stored as separate objects
    console.log('🔄 Trying to query for lesson objects...');

    // Get lessons from localStorage (stored when lessons are created)
    const storedLessons = JSON.parse(localStorage.getItem(`course_lessons_${courseId}`) || '[]');
    console.log('📋 Stored lessons from localStorage:', storedLessons);

    if (storedLessons.length > 0) {
      // Format the lessons to match the expected structure
      const formattedLessons = storedLessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        content_type: lesson.content_type,
        content_url: lesson.content_url,
        duration: Number(lesson.duration),
        order_index: Number(lesson.order_index),
      }));

      console.log('✅ Formatted lessons:', formattedLessons);
      return formattedLessons;
    }

    // If no lessons found, return empty array
    console.log('❌ No lessons found for course:', courseId);
    return [];
  } catch (error) {
    console.error('❌ Error fetching lessons for course:', error);
    return [];
  }
};
