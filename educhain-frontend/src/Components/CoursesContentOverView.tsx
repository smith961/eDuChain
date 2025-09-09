

import React, { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { courseStorage } from "../utils/courseStorage";
import { useAuth } from "../contexts/AuthContext";

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
  const account = useCurrentAccount();
  const { user } = useAuth();
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<{[key: string]: {status: 'not_started' | 'in_progress' | 'completed', currentLesson?: number}}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enrollment quiz state
  const [showEnrollmentQuiz, setShowEnrollmentQuiz] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<Course | null>(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sui Move enrollment questions based on lesson content
  const suiMoveEnrollmentQuestions = [
    {
      question: "What is the primary purpose of Move programming language?",
      options: [
        "Web development",
        "Blockchain smart contracts",
        "Mobile app development",
        "Data analysis"
      ],
      correctAnswer: 1,
      explanation: "Move was designed specifically for blockchain smart contracts with safety and security in mind."
    },
    {
      question: "Which of these is a key feature of Move that prevents common programming errors?",
      options: [
        "Dynamic typing",
        "Resource-oriented design",
        "Garbage collection",
        "Multi-threading"
      ],
      correctAnswer: 1,
      explanation: "Move's resource-oriented design treats digital assets as resources that cannot be copied or implicitly discarded."
    },
    {
      question: "In Sui Move, what does the 'key' ability allow a struct to do?",
      options: [
        "Be copied freely",
        "Be used as a key in global storage",
        "Be automatically deleted",
        "Store multiple values"
      ],
      correctAnswer: 1,
      explanation: "The 'key' ability allows a struct to be used as a key in Sui's global storage system."
    },
    {
      question: "What is the difference between Sui Move and other Move implementations?",
      options: [
        "Sui uses an account-based model",
        "Sui uses an object-based model",
        "Sui doesn't support smart contracts",
        "Sui uses JavaScript instead of Move"
      ],
      correctAnswer: 1,
      explanation: "Sui uses an innovative object-based model instead of the traditional account-based model used in other Move implementations."
    },
    {
      question: "Which Sui-specific feature allows flexible key-value storage on objects?",
      options: [
        "Shared Objects",
        "Dynamic Fields",
        "Generic Types",
        "Error Handling"
      ],
      correctAnswer: 1,
      explanation: "Dynamic Fields provide flexible key-value storage capabilities on Sui objects."
    }
  ];

  useEffect(() => {
    fetchPublishedCourses();
    if (user) {
      loadEnrolledCourses();
    }
  }, [user]);

  const fetchPublishedCourses = async () => {
    try {
      console.log("🔍 Fetching published courses...");
      setIsLoading(true);
      setError(null);

      // Get published courses from IndexedDB
      const publishedCoursesData = await courseStorage.getPublishedCourses();
      console.log("📊 Raw published courses data:", publishedCoursesData);

      // Convert to Course interface format
      const courses: Course[] = publishedCoursesData.map(storedCourse => ({
        id: storedCourse.objectId,
        title: storedCourse.title,
        description: storedCourse.description,
        instructor: storedCourse.instructor,
        category: storedCourse.category,
        difficulty_level: storedCourse.difficulty_level,
        estimated_duration: storedCourse.estimated_duration,
        objectId: storedCourse.objectId,
      }));

      console.log("✅ Converted courses for display:", courses);
      setPublishedCourses(courses);

      if (courses.length === 0) {
        console.log("⚠️ No published courses found in IndexedDB");
      }

    } catch (error) {
      console.error("❌ Error fetching published courses:", error);
      setError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrolledCourses = async () => {
    if (!user) return;

    try {
      // For now, we'll use localStorage as fallback until enrollment API is implemented
      // TODO: Replace with API call when enrollment system is ready
      const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      setEnrolledCourses(enrolled);

      // Load course progress
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      setCourseProgress(progress);
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
    }
  };

  const enrollInCourse = async (course: Course) => {
    if (!user && !account) {
      alert('Please connect your wallet first');
      return;
    }

    // For now, direct enrollment for all courses
    // Quiz will be moved to lesson component
    await completeEnrollment(course);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (currentQuizQuestion < suiMoveEnrollmentQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      evaluateQuiz(newAnswers);
    }
  };

  const evaluateQuiz = (answers: number[]) => {
    let correctAnswers = 0;
    suiMoveEnrollmentQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / suiMoveEnrollmentQuestions.length) * 100);

    if (score >= 60) { // 60% passing score
      // Pass - proceed with enrollment
      setTimeout(() => {
        completeEnrollment(selectedCourseForQuiz!);
      }, 2000); // Show results for 2 seconds
    } else {
      // Fail - show retry option
      setTimeout(() => {
        alert(`Quiz failed with ${score}%. You need 60% to enroll. Please try again.`);
        resetQuiz();
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setShowEnrollmentQuiz(false);
    setSelectedCourseForQuiz(null);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  const completeEnrollment = async (course: Course) => {
    try {
      // Use frontend service for enrollment
      const { frontendAuthService } = await import('../services/api');
      if (user?.walletAddress) {
        frontendAuthService.enrollInCourse(user.walletAddress, course.id);
      }

      // For now, use localStorage as fallback
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

      // Reset quiz state
      resetQuiz();
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll in course');
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
    <div className="flex bg-gray-900 text-white min-h-screen p-8 overflow-hidden">

      <div className="flex-1 mr-8 overflow-y-auto">
      
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
            {isLoading ? (
              <div className="col-span-2 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchPublishedCourses}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : publishedCourses.length === 0 ? (
              <div className="col-span-2 text-center">
                <p className="text-gray-400 mb-4">No published courses available yet.</p>
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
                <p className="text-sm text-gray-500">
                  Create and publish courses in the admin panel to see them here
                </p>
              </div>
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
                        disabled={!user && !account}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          (user || account)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {(user || account) ? 'Enroll' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    
      <div className="w-80 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 overflow-y-auto" style={{maxHeight: 'calc(100vh - 4rem)'}}>
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

      {/* Enrollment Quiz Modal */}
      {showEnrollmentQuiz && selectedCourseForQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Course Enrollment Assessment
              </h2>
              <p className="text-gray-600">
                Answer these questions to enroll in: <strong>{selectedCourseForQuiz.title}</strong>
              </p>
            </div>

            {!quizCompleted ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentQuizQuestion + 1} of {suiMoveEnrollmentQuestions.length}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuizQuestion + 1) / suiMoveEnrollmentQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {suiMoveEnrollmentQuestions[currentQuizQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {suiMoveEnrollmentQuestions[currentQuizQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Quiz Completed!</h3>
                  <p className="text-gray-600">
                    Evaluating your answers...
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <div className="text-sm text-gray-500">
                Passing Score: 60%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}