

import React, { useState, useEffect } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";

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

const totalEnrolledCourses = 8;
const inProgressCourses = 4;
const completedCourses = 6;

const yourCoursesData = [
  { course: 'Solidity Basics', progress: 620, xpEarned: 180, status: 'In Progress', action: 'Continue' },
  { course: 'DeFi Risk Management', progress: 180, xpEarned: 180, status: 'In Progress', action: 'Continue' },
  { course: 'NFT Economics', progress: 790, xpEarned: 180, status: 'Almost Done', action: 'Resume' },
  { course: 'DAO Governance', progress: 1, xpEarned: 1050, status: 'Completed', action: 'View' },
];

export default function CoursesContentOverView() {
  const suiClient = useSuiClient();
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<{[key: string]: {status: 'not_started' | 'in_progress' | 'completed', currentLesson?: number}}>({});

  useEffect(() => {
    fetchPublishedCourses();
    loadEnrolledCourses();
  }, []);

  const fetchPublishedCourses = async () => {
    try {
      const publishedCourseIds = JSON.parse(localStorage.getItem('publishedCourses') || '[]');

      if (publishedCourseIds.length === 0) {
        setPublishedCourses([]);
        return;
      }

      const packagedId = import.meta.env.VITE_PACKAGE_ID as string | undefined;

      const courseData: Course[] = await Promise.all(
        publishedCourseIds.map(async (courseId: string) => {
          const obj = await suiClient.getObject({
            id: courseId,
            options: {
              showType: true,
              showContent: true,
              showDisplay: true,
            },
          });

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
            id: courseId,
            title,
            description,
            instructor,
            category,
            difficulty_level,
            estimated_duration,
            objectId: courseId,
          };
        })
      );

      setPublishedCourses(courseData);
    } catch (error) {
      console.error("Error fetching published courses:", error);
    }
  };

  const loadEnrolledCourses = () => {
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setEnrolledCourses(enrolled);

    // Load course progress
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    setCourseProgress(progress);
  };

  const enrollInCourse = (course: Course) => {
    const enrolled = [...enrolledCourses];
    if (!enrolled.find(c => c.id === course.id)) {
      enrolled.push(course);
      setEnrolledCourses(enrolled);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));

      // Initialize progress
      const progress = { ...courseProgress };
      progress[course.id] = { status: 'not_started' as const };
      setCourseProgress(progress);
      localStorage.setItem('courseProgress', JSON.stringify(progress));
    }
  };

  const handleCourseAction = (course: Course) => {
    const progress = courseProgress[course.id];
    if (!progress || progress.status === 'not_started') {
      // Start the course - navigate to first lesson
      const updatedProgress = { ...courseProgress };
      updatedProgress[course.id] = { status: 'in_progress', currentLesson: 0 };
      setCourseProgress(updatedProgress);
      localStorage.setItem('courseProgress', JSON.stringify(updatedProgress));

      // Navigate to lesson viewer with first lesson
      // For now, we'll use the course's content URL or a default
      window.location.href = `/lesson/sui-move.mdx`;
    } else if (progress.status === 'in_progress') {
      // Continue from current lesson
      window.location.href = `/lesson/sui-move.mdx`;
    }
  };
  return (
    <div className="flex bg-gray-900 text-white min-h-screen p-8">
  
      <div className="flex-1 mr-8">
      
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Courses</h2>
          <p className="text-gray-400 mb-4">Browse your enrolled and discover new tracks.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">All Categories</h3>
              <p className="text-xl font-bold">{totalEnrolledCourses}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Difficulty</h3>
              <p className="text-xl font-bold">{inProgressCourses}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Status: Any</h3>
              <p className="text-xl font-bold">{completedCourses}</p>
            </div>
          </div>
        </div>


        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="grid grid-cols-5 gap-4 mb-4 text-gray-400 font-semibold">
              <div>Course</div>
              <div>Progress</div>
              <div>XP Earned</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {enrolledCourses.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No enrolled courses yet. Enroll in a course to get started!</p>
            ) : (
              enrolledCourses.map((course) => {
                const progress = courseProgress[course.id];
                const isStarted = progress && progress.status !== 'not_started';
                const buttonText = isStarted ? 'Continue' : 'Get Started';

                return (
                  <div key={course.id} className="grid grid-cols-5 gap-4 items-center py-3 border-t border-gray-700">
                    <div>{course.title}</div>
                    <div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: isStarted ? '25%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                    <div>{isStarted ? '50' : '0'}</div>
                    <div>{isStarted ? 'In Progress' : 'Not Started'}</div>
                    <div>
                      <button
                        onClick={() => handleCourseAction(course)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          isStarted
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

    
        <div>
          <h2 className="text-2xl font-bold mb-4">Discover Courses</h2>
          <div className="flex mb-4 space-x-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">Category: All</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">Price</div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {publishedCourses.length === 0 ? (
              <p className="text-gray-400 col-span-2 text-center">No published courses available yet.</p>
            ) : (
              publishedCourses.map((course) => (
                <div key={course.id} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
                  <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-500">
                    <span>Course Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      Difficulty: {course.difficulty_level} | Duration: {course.estimated_duration} min
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="text-indigo-400 hover:underline">Preview</button>
                      <button
                        onClick={() => enrollInCourse(course)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    
      <div className="w-80 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Filters</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Sort by: Popular</h3>
          <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option>Popular</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Duration: Any</h3>
          <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option>Any</option>
            <option>Short (0-1h)</option>
            <option>Medium (1-5h)</option>
            <option>Long (5+h)</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Tags: Web3, DeFi</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Web3</span>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">DeFi</span>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Solidity</span>
          </div>
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md mb-8">
          Clear Filters
        </button>


        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trending Tracks</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-semibold">Zero-Knowledge Proofs <span className="text-green-400 text-sm ml-2">New</span></h3>
              <p className="text-gray-400 text-sm">Track</p>
            </li>
            <li>
              <h3 className="font-semibold">DeFi Risk Analyst</h3>
              <p className="text-gray-400 text-sm">Track</p>
            </li>
            <li>
              <h3 className="font-semibold">NFT Creator Path</h3>
              <p className="text-gray-400 text-sm">Track</p>
            </li>
          </ul>
        </div>

        
        <div>
          <h2 className="text-2xl font-bold mb-4">From Your Mentors</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-semibold">Office hours with Alex Kim</h3>
              <p className="text-indigo-400 text-sm">Book</p>
            </li>
            <li>
              <h3 className="font-semibold">Solidity review session</h3>
              <p className="text-indigo-400 text-sm">Join</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}