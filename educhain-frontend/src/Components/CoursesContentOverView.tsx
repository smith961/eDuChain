

const enrolledCourses = 8;
const inProgressCourses = 4;
const completedCourses = 6;

const yourCoursesData = [
  { course: 'Solidity Basics', progress: 620, xpEarned: 180, status: 'In Progress', action: 'Continue' },
  { course: 'DeFi Risk Management', progress: 180, xpEarned: 180, status: 'In Progress', action: 'Continue' },
  { course: 'NFT Economics', progress: 790, xpEarned: 180, status: 'Almost Done', action: 'Resume' },
  { course: 'DAO Governance', progress: 1, xpEarned: 1050, status: 'Completed', action: 'View' },
];

const discoverCoursesData = [
  {
    title: 'Smart Contracts 101',
    description: 'Beginner - 1h',
    type: 'Enroll',
    imageUrl: 'https://res.cloudinary.com/dkrpginfm/image/upload/v1756946420/er_sqqc8m.png',
  },
  {
    title: 'Advanced Solidity Patterns',
    description: 'Intermediate - 2h',
    type: 'Purchase',
    imageUrl: 'https://res.cloudinary.com/dkrpginfm/image/upload/v1756946421/error_k3nrwt.png',
  },
  {
    title: 'DeFi Mechanics',
    description: 'Beginner - 7h',
    type: 'Enroll',
    imageUrl: 'https://res.cloudinary.com/dkrpginfm/image/upload/v1756946422/error1_rauo3s.png',
  },
  {
    title: 'DAO Governance',
    description: 'Advanced - 6h',
    type: 'Purchase',
    imageUrl: 'https://res.cloudinary.com/dkrpginfm/image/upload/v1756946423/error3_ooxdb6.png',
  },
];


export default function CoursesContentOverView() {
  return (
    <div className="flex bg-gray-900 text-white min-h-screen p-8">
  
      <div className="flex-1 mr-8">
      
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Courses</h2>
          <p className="text-gray-400 mb-4">Browse your enrolled and discover new tracks.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">All Categories</h3>
              <p className="text-xl font-bold">{enrolledCourses}</p>
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
            {yourCoursesData.map((course, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-center py-3 border-t border-gray-700">
                <div>{course.course}</div>
                <div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${course.progress / 10}%` }}
                    ></div>
                  </div>
                </div>
                <div>{course.xpEarned}</div>
                <div>{course.status}</div>
                <div>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      course.action === 'Continue' || course.action === 'Resume'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {course.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

    
        <div>
          <h2 className="text-2xl font-bold mb-4">Discover Courses</h2>
          <div className="flex mb-4 space-x-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">Category: All</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">Price</div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {discoverCoursesData.map((course, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
                <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-500 overflow-hidden">
                   <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-indigo-400 hover:underline">Preview</button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        course.type === 'Enroll' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {course.type}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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