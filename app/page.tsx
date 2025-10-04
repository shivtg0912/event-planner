import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Event Planner
        </h1>
        <p className="text-gray-600 text-center mb-8">
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
  );
}
