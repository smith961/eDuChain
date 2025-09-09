import React, { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import { Header } from "./Header";
import { Loader2, RefreshCcw } from "lucide-react";
import {  SuiObjectData } from "@mysten/sui/client";
import { useSuiClient } from "@mysten/dapp-kit";
import { courseStorage } from "../utils/courseStorage";
import { useAuth } from "../contexts/AuthContext";


interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
  min?: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty_level: number;
  estimated_duration: number;
  objectId: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
  children,
  min,
  ...props
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "textarea" ? (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y ${className}`}
        placeholder={placeholder}
        {...props}
      ></textarea>
    ) : type === "select" ? (
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white appearance-none pr-10 ${className}`}
        {...props}

      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`}
        placeholder={placeholder}
        min={type === "number" ? min : undefined}
        {...props}

      />
    )}

  </div>
);



const CourseCreationForm: React.FC = () => {
    const account =   useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    difficulty_level: 1,
    estimated_duration: 0,
    });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create course");

  const [courses, setCourses] = useState<Course[]>([]);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content_type: '',
    content_url: '',
    selected_content: '',
    duration: 0,
    order_index: 0,
  });

  const [availableLessons, setAvailableLessons] = useState<string[]>([]);
  

  

  const categories = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Science",
    "Mathematics",
    "Language",
    "Music",
    "Other",
  ];

  const difficultyLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Intermediate" },
    { value: 3, label: "Advanced" },
    { value: 4, label: "Expert" },
  ];

  


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "difficulty_level" || name === "estimated_duration" ? parseInt(value) : value,
    }));
  };

  const handleLessonInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLessonForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: name === "duration" || name === "order_index" ? parseInt(value) : value,
      };

      // If lesson content is selected, automatically set the content URL
      if (name === "selected_content" && value) {
        updatedForm.content_url = `/lesson/${value}`;
      }

      return updatedForm;
    });
  };
  const isValidSuiAddress = (address: string): boolean => {
    return /^0x[0-9a-f]{1,64}$/.test(address) && address.length === 66;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!isValidSuiAddress(formData.instructor)) {
      alert("Please enter a valid Sui wallet address (0x followed by 64 hex characters)");
      return;
    }

    const packageId = import.meta.env.VITE_PACKAGE_ID as string | undefined;
    const ADMIN_CAP_ID = import.meta.env.VITE_ADMIN_CAP_ID as string;
    const Registry = import.meta.env.VITE_EDUCHAINRegistry as string;
    setLoading(true);

    try {
      const tx = new Transaction();


      if (!ADMIN_CAP_ID || !Registry) {
        throw new Error("Admin Cap or Registry ID not configured");
      }


      const clock = tx.sharedObjectRef({
        objectId: '0x6', // Fixed Clock object ID
        initialSharedVersion: 1,
        mutable: false,
      });




      tx.moveCall({
        target: `${packageId}::educhain::create_course`,
        arguments: [
          tx.object(ADMIN_CAP_ID), // AdminCap object
          tx.object(Registry),
          tx.pure.string(formData.title),
          tx.pure.string(formData.description),
          tx.pure.address(formData.instructor),
          tx.pure.string(formData.category),
          tx.pure.u8(formData.difficulty_level),
          tx.pure.u64(formData.estimated_duration),
          clock,
        ],
      });

      const result = await signAndExecute({ transaction: tx });

      console.log("✅ Transaction success:", result);

      // Get full transaction details to extract created objects
      const txDetails = await suiClient.getTransactionBlock({
        digest: result.digest,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      // Extract created course ID from objectChanges
      const objectChanges = txDetails.objectChanges || [];
      const createdCourse = objectChanges.find((change: any) =>
        change.type === 'created' && change.objectType?.includes('::educhain::Course')
      );
      if (createdCourse) {
        const courseId = createdCourse.objectId;

        // Save course to IndexedDB
        try {
          await courseStorage.saveCourse({
            id: courseId,
            title: formData.title,
            description: formData.description,
            instructor: formData.instructor,
            category: formData.category,
            difficulty_level: formData.difficulty_level,
            estimated_duration: formData.estimated_duration,
            objectId: courseId,
            createdAt: new Date().toISOString(),
            isPublished: false,
          });
          console.log("✅ Course saved to IndexedDB");
        } catch (storageError) {
          console.error("❌ Failed to save course to IndexedDB:", storageError);
        }
      }

      alert("🎉 Course created successfully on-chain!");
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      alert("Failed to create course. Check console for details.");
    } finally {
      setLoading(false);
    }

    setActiveTab("view courses");
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || !selectedCourse) {
      alert("Please connect wallet and select a course");
      return;
    }

    const packageId = import.meta.env.VITE_PACKAGE_ID as string | undefined;
    const ADMIN_CAP_ID = import.meta.env.VITE_ADMIN_CAP_ID as string;
    setLoading(true);

    try {
      const tx = new Transaction();

      if (!ADMIN_CAP_ID) {
        throw new Error("Admin Cap ID not configured");
      }

      tx.moveCall({
        target: `${packageId}::educhain::add_lesson`,
        arguments: [
          tx.object(ADMIN_CAP_ID),
          tx.object(selectedCourse.objectId),
          tx.pure.string(lessonForm.title),
          tx.pure.string(lessonForm.content_type),
          tx.pure.string(lessonForm.content_url),
          tx.pure.u64(lessonForm.duration),
          tx.pure.u64(lessonForm.order_index),
        ],
      });

      const result = await signAndExecute({ transaction: tx });

      console.log("✅ Add lesson success:", result);
      alert("Lesson added successfully!");

      // Reset form and close modal
      setLessonForm({
        title: '',
        content_type: '',
        content_url: '',
        selected_content: '',
        duration: 0,
        order_index: 0,
      });
      setShowLessonModal(false);
      setSelectedCourse(null);

      // Refetch courses to update the list
      fetchCourses();
    } catch (err) {
      console.error("❌ Add lesson failed:", err);
      alert("Failed to add lesson. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishCourse = async (course: Course) => {
    if (!account) {
      alert("Please connect wallet");
      return;
    }

    console.log("🚀 Starting course publish process for:", course.title);
    setLoading(true);

    try {
      const packageId = import.meta.env.VITE_PACKAGE_ID as string | undefined;
      const ADMIN_CAP_ID = import.meta.env.VITE_ADMIN_CAP_ID as string;

      if (!ADMIN_CAP_ID) {
        throw new Error("Admin Cap ID not configured");
      }

      console.log("📦 Publishing course on blockchain...");
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::educhain::publish_course`,
        arguments: [
          tx.object(ADMIN_CAP_ID),
          tx.object(course.objectId),
        ],
      });

      const result = await signAndExecute({ transaction: tx });
      console.log("✅ Blockchain publish success:", result);

      // Update course as published in IndexedDB
      console.log("💾 Updating IndexedDB publish status...");
      try {
        await courseStorage.publishCourse(course.objectId);
        console.log("✅ IndexedDB publish status updated successfully");

        // Verify the update
        const publishedCourses = await courseStorage.getPublishedCourses();
        console.log("📊 Current published courses:", publishedCourses.length);

      } catch (storageError) {
        console.error("❌ Failed to update publish status in IndexedDB:", storageError);
      }

      alert("Course published successfully!");

      // Refetch courses to update the list
      console.log("🔄 Refetching courses...");
      fetchCourses();

    } catch (err) {
      console.error("❌ Publish course failed:", err);
      alert("Failed to publish course. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    console.log("🚀 fetchCourses called");
    if (!user && !account) {
      console.log("❌ No user or wallet connected, returning early");
      return;
    }

    setLoading(true);
    try {
      console.log("📊 Fetching courses from IndexedDB...");
      // Get courses from IndexedDB
      const storedCourses = await courseStorage.getAllCourses();
      console.log("📈 Raw stored courses:", storedCourses);

      // Convert stored courses to Course interface format
      const courseData: Course[] = storedCourses.map(storedCourse => ({
        id: storedCourse.objectId,
        title: storedCourse.title,
        description: storedCourse.description,
        instructor: storedCourse.instructor,
        category: storedCourse.category,
        difficulty_level: storedCourse.difficulty_level,
        estimated_duration: storedCourse.estimated_duration,
        objectId: storedCourse.objectId,
      }));

      console.log("✅ Converted course data:", courseData);
      setCourses(courseData);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      alert("Failed to fetch courses. Check console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  // React.useEffect(() => {

  //     fetchCourses();

  // }, [account?.address]);

  useEffect(() => {
    console.log("🔍 useEffect triggered - activeTab:", activeTab, "user:", user, "account:", account);
    if (activeTab === "view courses") {
      if (user || account) {
        console.log("✅ User authenticated or wallet connected, fetching courses...");
        fetchCourses();
      } else {
        console.log("⚠️ User not authenticated and no wallet connected, skipping course fetch");
      }
    }
  }, [activeTab, user, account]);

  useEffect(() => {
    // Load available lesson content files
    loadAvailableLessons();
  }, []);

  const loadAvailableLessons = async () => {
    try {
      // For now, we'll hardcode the available lessons
      // In a real app, you might fetch this from an API or scan the folder
      const lessons = ['sui-move.mdx', 'java-basics.mdx'];
      setAvailableLessons(lessons);
    } catch (error) {
      console.error('Error loading available lessons:', error);
    }
  };
  return (
    <>
      {activeTab === "create course" ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
            <div className="text-center mb-10">
              <Header activeTab={activeTab} onTabChange={setActiveTab} />
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 mt-3 leading-tight">
                Create New Course
              </h1>
              <p className="text-lg text-gray-600">Empower learners with your knowledge.</p>
            </div>

            <form onSubmit={handleSubmit} className=" space-y-7">
              {/* Title */}
              <FormInput
                label="Course Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mastering React Hooks"
              />

              {/* Description */}
              <FormInput
                label="Course Description"
                id="description"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Provide a detailed overview of the course content and learning outcomes."
              />

              {/* Instructor Address */}
              <FormInput
                label="Instructor Wallet Address"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                required
                className="font-mono text-sm"
                placeholder="0x..."
              >
                <p className="text-sm text-gray-500 mt-2">
                  Enter the instructor&apos;s blockchain wallet address.
                </p>
              </FormInput>

              {/* Category */}
              <FormInput
                label="Category"
                id="category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="pr-10 text-gray-900 bg-white"
              >
                <option value="" disabled className="text-gray-400">
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category} className="text-gray-900" hidden={category === " "}>
                    {category}
                  </option>
                ))}
              </FormInput>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {difficultyLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center
                  ${formData.difficulty_level === level.value
                          ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-700"
                        }`}
                    >
                      <input
                        type="radio"
                        name="difficulty_level"
                        value={level.value}
                        checked={formData.difficulty_level === level.value}
                        onChange={handleInputChange}
                        className="sr-only"
                        required
                      />
                      <span className="text-base font-semibold">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estimated Duration */}
              <div>
                <label
                  htmlFor="estimated_duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Estimated Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="estimated_duration"
                    name="estimated_duration"
                    value={formData.estimated_duration}
                    onChange={handleInputChange}
                    required
                    min={0}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-20"
                    placeholder="e.g., 180"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    minutes
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Approximate total duration of all lessons combined.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    } text-white font-extrabold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-lg`}
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
            <div className="text-center mb-10">
              <Header activeTab={activeTab} onTabChange={setActiveTab} />
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3 mt-3 leading-tight">
                View Courses
              </h1>
              <p className="text-lg text-gray-600">Empower learners with your knowledge.</p>
            </div>
           
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Courses Created
          </h2>
          <p className="text-gray-600 text-lg">
           
            {courses.length} Course{courses.length !== 1 ? "s" : ""} in your collection
           
          </p>
        </div>
        <button
          onClick={fetchCourses}
          disabled={loading || (!user && !account)}
          className="bg-black flex items-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5" />
          )}
          Refresh
        </button>
      </div>

      {/* Courses List */}
      <div className="mt-8">
        {(!user && !account) ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please connect your wallet to view your courses</p>
            <p className="text-sm text-gray-500">You need to be authenticated to manage courses</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No courses found. Create your first course!</p>
            <button
              onClick={async () => {
                console.log("🔍 Checking IndexedDB contents...");
                try {
                  const allCourses = await courseStorage.getAllCourses();
                  const publishedCourses = await courseStorage.getPublishedCourses();
                  console.log("📊 All courses in DB:", allCourses);
                  console.log("📊 Published courses in DB:", publishedCourses);
                  alert(`Found ${allCourses.length} total courses, ${publishedCourses.length} published courses`);
                } catch (error) {
                  console.error("❌ Error checking DB:", error);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium mb-4"
            >
              Check Database
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p><strong>Instructor:</strong> {course.instructor}</p>
                  <p><strong>Category:</strong> {course.category}</p>
                  <p><strong>Difficulty:</strong> {course.difficulty_level}</p>
                  <p><strong>Duration:</strong> {course.estimated_duration} minutes</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowLessonModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add Lesson
                  </button>
                  <button
                    onClick={() => handlePublishCourse(course)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            </div>
          </div>
        </div>
)}

{/* Lesson Addition Modal */}
{showLessonModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Add Lesson to {selectedCourse?.title}</h2>
      <form onSubmit={handleAddLesson} className="space-y-4">
        <FormInput
          label="Lesson Title"
          id="lesson_title"
          name="title"
          value={lessonForm.title}
          onChange={handleLessonInputChange}
          required
          placeholder="e.g., Introduction to React"
        />

        <FormInput
          label="Content Type"
          id="content_type"
          name="content_type"
          type="select"
          value={lessonForm.content_type}
          onChange={handleLessonInputChange}
          required
        >
          <option value="" disabled>Select content type</option>
          <option value="Video">Video</option>
          <option value="Text">Text</option>
          <option value="Document">Document</option>
        </FormInput>

        <FormInput
          label="Lesson Content"
          id="selected_content"
          name="selected_content"
          type="select"
          value={lessonForm.selected_content}
          onChange={handleLessonInputChange}
          required
        >
          <option value="" disabled>Select lesson content</option>
          {availableLessons.map((lesson) => (
            <option key={lesson} value={lesson}>
              {lesson.replace('.mdx', '').replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </FormInput>

        <FormInput
          label="Content URL"
          id="content_url"
          name="content_url"
          value={lessonForm.content_url}
          onChange={handleLessonInputChange}
          placeholder="Or enter custom URL"
        />

        <FormInput
          label="Duration (minutes)"
          id="duration"
          name="duration"
          type="number"
          value={lessonForm.duration}
          onChange={handleLessonInputChange}
          required
          min={0}
        />

        <FormInput
          label="Order Index"
          id="order_index"
          name="order_index"
          type="number"
          value={lessonForm.order_index}
          onChange={handleLessonInputChange}
          required
          min={0}
        />

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Lesson"}
          </button>
          <button
            type="button"
            onClick={() => setShowLessonModal(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

</>


);
};

export default CourseCreationForm;




