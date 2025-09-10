import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';

const LessonViewer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const account = useCurrentAccount();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Quiz questions for different course types
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

  const javaBasicsEnrollmentQuestions = [
    {
      question: "What is the main difference between Java and JavaScript?",
      options: [
        "Java is compiled, JavaScript is interpreted",
        "Java runs on servers, JavaScript runs in browsers",
        "Java is object-oriented, JavaScript is functional",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Java is a compiled, object-oriented language that can run on servers, while JavaScript is an interpreted language primarily used in web browsers."
    },
    {
      question: "Which of these is the correct way to declare a variable in Java?",
      options: [
        "var myVar = 5;",
        "let myVar = 5;",
        "int myVar = 5;",
        "const myVar = 5;"
      ],
      correctAnswer: 2,
      explanation: "In Java, you declare variables with a type followed by the variable name, like 'int myVar = 5;' for integer variables."
    },
    {
      question: "What does JVM stand for in Java?",
      options: [
        "Java Virtual Machine",
        "Java Variable Manager",
        "JavaScript Virtual Machine",
        "Just Virtual Memory"
      ],
      correctAnswer: 0,
      explanation: "JVM stands for Java Virtual Machine, which is responsible for executing Java bytecode on any platform."
    },
    {
      question: "Which of these is NOT a primitive data type in Java?",
      options: [
        "int",
        "boolean",
        "String",
        "double"
      ],
      correctAnswer: 2,
      explanation: "String is not a primitive data type in Java - it's a class/object. Primitive types include int, boolean, double, char, etc."
    },
    {
      question: "What is the purpose of the 'public static void main(String[] args)' method in Java?",
      options: [
        "To create objects",
        "To define variables",
        "To start program execution",
        "To handle exceptions"
      ],
      correctAnswer: 2,
      explanation: "The main method is the entry point of any Java program - it's where program execution begins."
    }
  ];

  useEffect(() => {
    if (lessonId) {
      loadLessonContent(lessonId);
      // Check if user needs to take enrollment quiz
      checkEnrollmentStatus();
    }
  }, [lessonId]);

  const checkEnrollmentStatus = () => {
    // Check if user has already passed the enrollment quiz for this course type
    const lessonType = lessonId?.toLowerCase() || '';
    const quizPassedKey = `quiz_passed_${lessonType}`;

    const hasPassedQuiz = localStorage.getItem(quizPassedKey) === 'true';

    if (!hasPassedQuiz && (lessonType.includes('sui') || lessonType.includes('java'))) {
      setShowQuiz(true);
    }
  };

  const loadLessonContent = async (lessonFile: string) => {
    try {
      setLoading(true);
      setError(null);

      // First try to fetch from local LessonContents folder
      try {
        const response = await fetch(`/LessonContents/${lessonFile}`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
          return;
        }
      } catch (localError) {
        console.log('Local file not found, checking for external URL...');
      }

      // If local file not found, check if there's an external URL in the lesson data
      // For now, show a placeholder message
      const lessonType = lessonFile.toLowerCase();
      if (lessonType.includes('sui')) {
        setContent(`# Introduction to Sui Move Programming

This lesson covers the fundamentals of Sui Move programming language.

## What is Sui Move?

Sui Move is a smart contract programming language designed specifically for the Sui blockchain. It provides:

- **Resource-oriented programming** for digital assets
- **Type safety** to prevent common programming errors
- **Object-based model** for flexible data structures

## Key Features

### 1. Objects and Ownership
In Sui Move, digital assets are represented as objects with clear ownership rules.

### 2. Move Semantics
Move uses move semantics to ensure that values are not accidentally copied or lost.

### 3. Type System
Strong static typing prevents runtime errors and ensures contract safety.

## Getting Started

To start developing with Sui Move:

1. Install Sui CLI
2. Set up your development environment
3. Create your first smart contract
4. Deploy to Sui testnet

*Note: This is placeholder content. Add your actual lesson content here.*`);
      } else if (lessonType.includes('java')) {
        setContent(`# Java Programming Fundamentals

Welcome to Java programming! This comprehensive guide will take you from beginner to advanced concepts.

## What is Java?

Java is a high-level, object-oriented programming language developed by Sun Microsystems (now Oracle). It's known for:

- **Platform independence** ("Write once, run anywhere")
- **Strong type system** for reliability
- **Rich standard library** for productivity
- **Enterprise-grade** applications

## Core Concepts

### 1. Variables and Data Types
Java supports various data types including primitives and objects.

### 2. Control Structures
Learn about loops, conditionals, and flow control.

### 3. Object-Oriented Programming
Master classes, objects, inheritance, and polymorphism.

### 4. Exception Handling
Understand how to handle errors gracefully.

## Development Environment

To start coding in Java:

1. Install JDK (Java Development Kit)
2. Set up an IDE (Eclipse, IntelliJ IDEA, or VS Code)
3. Write your first "Hello World" program
4. Learn about packages and imports

*Note: This is placeholder content. Add your actual lesson content here.*`);
      } else {
        setContent(`# Lesson Content

Welcome to this lesson! The content for this lesson is being prepared.

## What You'll Learn

- Key concepts and principles
- Practical examples and exercises
- Best practices and tips

## Getting Started

Please wait while we prepare the lesson materials for you.

*Note: This is placeholder content. Add your actual lesson content here.*`);
      }
    } catch (err) {
      console.error('Error loading lesson content:', err);
      setError('Failed to load lesson content');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuizQuestions = () => {
    const lessonType = lessonId?.toLowerCase() || '';
    if (lessonType.includes('sui')) {
      return suiMoveEnrollmentQuestions;
    } else if (lessonType.includes('java')) {
      return javaBasicsEnrollmentQuestions;
    }
    return suiMoveEnrollmentQuestions; // default
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    const questions = getCurrentQuizQuestions();
    if (currentQuizQuestion < questions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      evaluateQuiz(newAnswers);
    }
  };

  const evaluateQuiz = (answers: number[]) => {
    const questions = getCurrentQuizQuestions();
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 60;

    setQuizPassed(passed);

    if (passed) {
      // Mark quiz as passed in localStorage
      const lessonType = lessonId?.toLowerCase() || '';
      const quizPassedKey = `quiz_passed_${lessonType}`;
      localStorage.setItem(quizPassedKey, 'true');

      // Auto-hide quiz after 3 seconds
      setTimeout(() => {
        setShowQuiz(false);
      }, 3000);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setQuizPassed(false);
  };

  const renderMarkdown = (markdown: string) => {
    // Simple markdown renderer - in a real app, you'd use a proper MDX renderer
    const lines = markdown.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className={`language-${codeBlockLanguage}`}>
                {codeBlockContent.trim()}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeBlockContent = '';
          codeBlockLanguage = '';
        } else {
          // Start of code block
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3);
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n';
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mb-4 mt-8 text-gray-900">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-bold mb-3 mt-6 text-gray-800">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold mb-2 mt-4 text-gray-700">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={index} />);
      } else {
        elements.push(
          <p key={index} className="mb-3 text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/user_dashboard'}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              {renderMarkdown(content)}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="text-4xl mb-3">🧠</div>
              <h2 className="text-2xl font-bold mb-2">
                Knowledge Check Required
              </h2>
              <p className="text-blue-100">
                Complete this assessment to access: <strong className="text-white">{lessonId?.replace('.mdx', '').replace('-', ' ').toUpperCase()}</strong>
              </p>
            </div>

            <div className="px-8 pb-8">
              {!quizCompleted ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentQuizQuestion + 1} of {getCurrentQuizQuestions().length}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuizQuestion + 1) / getCurrentQuizQuestions().length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-relaxed">
                      {getCurrentQuizQuestions()[currentQuizQuestion].question}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      Choose the best answer below
                    </p>
                  </div>

                  <div className="space-y-4">
                    {getCurrentQuizQuestions()[currentQuizQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        className="w-full p-6 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-700 text-sm">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium leading-relaxed">{option}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  {quizPassed ? (
                    <>
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">Quiz Passed!</h3>
                      <p className="text-gray-600">
                        Congratulations! You can now access the lesson content.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">❌</div>
                      <h3 className="text-xl font-bold text-red-600 mb-2">Quiz Failed</h3>
                      <p className="text-gray-600 mb-4">
                        You need 60% to pass. Please try again.
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Skip for Now
              </button>
              <div className="text-sm text-gray-500">
                Passing Score: 60%
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default LessonViewer;