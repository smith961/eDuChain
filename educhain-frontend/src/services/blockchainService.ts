import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

// Create Sui client
export const suiClient = new SuiClient({
  url: getFullnodeUrl('devnet'), // Change to 'mainnet' for production
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
  const adminCapId = getAdminCapId();
  const registryId = getRegistryId();

  const clock = tx.sharedObjectRef({
    objectId: '0x6', // Fixed Clock object ID
    initialSharedVersion: 1,
    mutable: false,
  });

  tx.moveCall({
    target: `${packageId}::educhain::create_course`,
    arguments: [
      tx.object(adminCapId), // AdminCap object
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
  const adminCapId = getAdminCapId();

  tx.moveCall({
    target: `${packageId}::educhain::add_lesson`,
    arguments: [
      tx.object(adminCapId),
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
  const adminCapId = getAdminCapId();

  tx.moveCall({
    target: `${packageId}::educhain::publish_course`,
    arguments: [
      tx.object(adminCapId),
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
