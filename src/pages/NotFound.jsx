import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center">
        
        {/* Line 8-10: Large 404 text */}
        <h1 className="text-9xl font-bold text-gray-900">
          404
        </h1>

        {/* Line 12-15: Error message */}
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Page Not Found
        </p>

        {/* Line 17-20: Description */}
        <p className="text-gray-600 mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>

        {/* Line 22-29: Home link */}
        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
