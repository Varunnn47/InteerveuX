import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Results() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interviewAnswers = localStorage.getItem("interviewAnswers");

    if (!interviewAnswers) {
      navigate("/dashboard");
      return;
    }

    // Send answers to backend for AI feedback + save in DB
    axios
      .post("/api/interview/results", {
        answers: JSON.parse(interviewAnswers),
      })
      .then((res) => setResults(res.data))
      .catch((err) => console.error("Error fetching results", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        ⏳ Generating your results...
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-600">
        ❌ No results found. Try again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        🏆 Interview Results
      </h1>

      {/* Behavioral Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">🗣 Behavioral Round</h2>
        {results.behavioral?.map((q, idx) => (
          <div key={idx} className="p-4 border rounded mb-3 bg-gray-50">
            <p className="font-medium">Q{idx + 1}: {q.question}</p>
            <p className="text-gray-700">Your Answer: {q.text}</p>
            <p className="text-green-600 mt-1">AI Feedback: {q.feedback}</p>
          </div>
        ))}
      </section>

      {/* Coding Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">💻 Coding Round</h2>
        {results.coding?.map((q, idx) => (
          <div key={idx} className="p-4 border rounded mb-3 bg-gray-50">
            <p className="font-medium">Q{idx + 1}: {q.question}</p>
            <p className="text-gray-700">Language: {q.language}</p>
            <p className="text-gray-700">Submitted Code:</p>
            <pre className="bg-black text-white p-3 rounded mt-2 text-sm overflow-x-auto">
              {q.code}
            </pre>
            <p className="mt-2">
              ✅ Status:{" "}
              <span className="text-green-600">{q.result?.status?.description}</span>
            </p>
            {q.result?.stdout && (
              <p>📤 Output: <span className="text-blue-600">{q.result.stdout}</span></p>
            )}
            {q.result?.stderr && (
              <p className="text-red-600">⚠️ Errors: {q.result.stderr}</p>
            )}
          </div>
        ))}
      </section>

      {/* AI Summary */}
      <section className="mb-8 p-6 border rounded bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3">📊 Overall Feedback</h2>
        <p className="text-gray-800 whitespace-pre-line">{results.summary}</p>
      </section>

      <div className="flex justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
