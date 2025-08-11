import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto p-4">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-semibold text-green-800 mb-2">
          Registration Successful!
        </h1>
        
        <p className="text-sm text-gray-700 mb-6">
          The person has been successfully registered in our database.
        </p>

        {/* Action Buttons */}
        <div className="space-x-2">
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 shadow"
          >
            Register Another Person
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 shadow"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow border border-green-200">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            What happens next?
          </h3>
          <ul className="text-gray-600 space-y-1 text-left max-w-md mx-auto text-sm">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Data is securely stored in our database
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              You can view all registrations in the Registered List
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Reports can be generated for analysis
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
