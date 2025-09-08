import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LessonViewer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId) {
      loadLessonContent(lessonId);
    }
  }, [lessonId]);

  const loadLessonContent = async (lessonFile: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the MDX file from the public folder
      const response = await fetch(`/LessonContents/${lessonFile}`);
      if (!response.ok) {
        throw new Error('Failed to load lesson content');
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Error loading lesson content:', err);
      setError('Failed to load lesson content');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            {renderMarkdown(content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;