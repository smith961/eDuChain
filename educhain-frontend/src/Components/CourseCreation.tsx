import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import { Header } from "./Header";
import { Loader2, RefreshCcw } from "lucide-react";
import {  SuiObjectData } from "@mysten/sui/client";
import { useSuiClient } from "@mysten/dapp-kit";








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
        {...props}

      />
    )}

  </div>
);



const CourseCreationForm: React.FC = () => {
    const account =   useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
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
      alert("🎉 Course created successfully on-chain!");
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      alert("Failed to create course. Check console for details.");
    } finally {
      setLoading(false);
    }

    setActiveTab("view courses");
  };

  const fetchCourses = async () => {
  
    if(!account?.address) return;

    setLoading(true);
    try{
      const packagedId = import.meta.env.VITE_PACKAGE_ID as string | undefined;
      const structType = packagedId
      ? `${packagedId}::educhain::Course`
      : undefined;

      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: structType ? { StructType: structType } : undefined,
        options: {
          showType: true, 
          showContent: true,
          showDisplay: true,
        },
      });

      const courseObjects = objects.data.filter((obj) => {
        const data = obj.data as SuiObjectData;
        const type = data?.type || "";
        return structType
          ? type === structType
          : type.includes("::educhain::Course");  
      });

      const courseData: Course[] = await Promise.all(
        courseObjects.map(async (obj) => {
          const data = obj.data as SuiObjectData;
          const content = (
            data as SuiObjectData & {
              content?: { fields?: Record<string, unknown> };
            }
          )?.content;

          const fields = content?.fields || {};

          const title = (fields.title as string) || "Untitled";
          const description = (fields.description as string) || "No description";
          const instructor = (fields.instructor as string) || "Unknown";
          const category = (fields.category as string) || "Uncategorized";
          const difficulty_level = (fields.difficulty_level as number) || 1;
          const estimated_duration = (fields.estimated_duration as number) || 0;
          
          return {
            id: obj.data?.objectId || "",
            title,
            description,
            instructor,
            category,
            difficulty_level,
            estimated_duration,
            objectId: obj.data?.objectId|| "",
          };
        })
      );

      setCourses(courseData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to fetch courses. Check console for details.");
    } finally {
      setLoading(false);

      }
    };
  
  // React.useEffect(() => {
   
  //     fetchCourses();
    
  // }, [account?.address]);
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
          disabled={loading}
          className="bg-black flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCcw className="w-5 h-5" />
          )}
          Refresh 
        </button>
      </div>
            </div>
          </div>
        </div>

      )}
    </>


  );
};

export default CourseCreationForm;




