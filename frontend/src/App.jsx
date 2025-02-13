import './App.css'

function App() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
    {/* Main Card Container */}
    <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 
                    transform hover:scale-105 transition-all duration-300">
      
      {/* Header with Animation */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                       from-blue-600 to-purple-600 animate-pulse">
          Natura Properties
        </h1>
        <p className="mt-4 text-gray-600 text-xl">
          Your Dream Home Awaits
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Feature 1 */}
        <div className="group bg-blue-50 p-6 rounded-xl hover:bg-blue-100 transition-colors">
          <div className="h-12 w-12 bg-blue-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-blue-800">Modern Design</h3>
          <p className="text-blue-600">Stylish and contemporary spaces</p>
        </div>

        {/* Feature 2 */}
        <div className="group bg-purple-50 p-6 rounded-xl hover:bg-purple-100 transition-colors">
          <div className="h-12 w-12 bg-purple-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-purple-800">Prime Location</h3>
          <p className="text-purple-600">In the heart of the city</p>
        </div>

        {/* Feature 3 */}
        <div className="group bg-pink-50 p-6 rounded-xl hover:bg-pink-100 transition-colors">
          <div className="h-12 w-12 bg-pink-500 rounded-lg mb-4 
                        group-hover:rotate-12 transition-transform">
          </div>
          <h3 className="font-bold text-pink-800">Luxury Living</h3>
          <p className="text-pink-600">Premium amenities included</p>
        </div>
      </div>

      {/* Animated Button */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                         text-white rounded-full font-bold text-lg
                         hover:shadow-lg hover:-translate-y-1 
                         transition-all duration-300
                         animate-bounce">
          Explore Properties
        </button>
      </div>
    </div>
  </div>
)
}


export default App




