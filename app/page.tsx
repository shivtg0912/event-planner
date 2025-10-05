import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left side - Graphic */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="relative">
            {/* Calendar Icon Graphic */}
            <svg className="w-100 h-96" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Calendar base */}
              <rect x="60" y="80" width="280" height="280" rx="20" fill="white" fillOpacity="0.95"/>
              
              {/* Calendar header */}
              <rect x="60" y="80" width="280" height="60" rx="20" fill="#3B82F6"/>
              <rect x="60" y="120" width="280" height="20" fill="#3B82F6"/>
              
              {/* Binding rings */}
              <circle cx="120" cy="70" r="12" fill="white" fillOpacity="0.9"/>
              <circle cx="200" cy="70" r="12" fill="white" fillOpacity="0.9"/>
              <circle cx="280" cy="70" r="12" fill="white" fillOpacity="0.9"/>
              
              {/* Calendar grid */}
              <rect x="85" y="170" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="135" y="170" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="185" y="170" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="235" y="170" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="285" y="170" width="35" height="35" rx="5" fill="#DBEAFE"/>
              
              <rect x="85" y="220" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="135" y="220" width="35" height="35" rx="5" fill="#3B82F6"/>
              <rect x="185" y="220" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="235" y="220" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="285" y="220" width="35" height="35" rx="5" fill="#DBEAFE"/>
              
              <rect x="85" y="270" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="135" y="270" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="185" y="270" width="35" height="35" rx="5" fill="#10B981"/>
              <rect x="235" y="270" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="285" y="270" width="35" height="35" rx="5" fill="#DBEAFE"/>
              
              <rect x="85" y="320" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="135" y="320" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="185" y="320" width="35" height="35" rx="5" fill="#DBEAFE"/>
              <rect x="235" y="320" width="35" height="35" rx="5" fill="#F59E0B"/>
              <rect x="285" y="320" width="35" height="35" rx="5" fill="#DBEAFE"/>
              
              {/* Decorative elements */}
              <circle cx="350" cy="100" r="30" fill="white" fillOpacity="0.2"/>
              <circle cx="50" cy="300" r="40" fill="white" fillOpacity="0.15"/>
              <circle cx="380" cy="320" r="25" fill="white" fillOpacity="0.2"/>
            </svg>
          </div>
        </div>

        {/* Right side - Auth box */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-center lg:pr-16">
          <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
            <h1 className="text-4xl font-black text-center mb-8 text-gray-800 tracking-tight">
              Event Planner
            </h1>
            <p className="text-gray-600 text-center mb-8 font-semibold">
              Plan and manage your events with ease
            </p>
            <div className="space-y-4">
              <Link 
                href="/auth/signin"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded block text-center transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded block text-center transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}