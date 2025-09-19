import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold text-blue-600 mb-6">
              IntervueX
            </h1>
            <p className="text-gray-700 text-lg mb-6">
              Smart AI-powered interview platform with resume analysis, mock interviews, coding challenges, and personalized feedback.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="/InterveuX.jpg"
              alt="IntervueX Hero"
              className="rounded-lg shadow-lg h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-blue-600 mb-12 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Resume Analyzer */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">📄 Resume Analyzer</h3>
            <p className="text-gray-700">
              Upload your resume and get AI-driven insights, skill extraction, and role suggestions.
            </p>
          </div>

          {/* Mock Interview */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🎤 Mock Interview</h3>
            <p className="text-gray-700">
              Conduct AI-powered mock interviews with voice + webcam, HR-style questions, and real-time feedback.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3"> Results & Feedback </h3>
            <p className="text-gray-700">
              Access common interview questions, tips, and guidance to improve your performance.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Career?</h2>
        <p className="mb-6">Sign up or login to start your AI-powered interview journey today!</p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100"
        >
          Get Started
        </button>
      </section>
    </div>
  );
}
