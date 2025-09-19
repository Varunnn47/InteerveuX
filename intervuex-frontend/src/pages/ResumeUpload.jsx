import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume first!");

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await axios.post("/api/resume/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(res.data.feedback || "No feedback received.");
    } catch (err) {
      console.error("Error analyzing resume", err);
      alert("Failed to analyze resume. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        📄 Resume Analyzer
      </h1>

      <div className="flex flex-col items-center gap-4 mb-6">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border rounded"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {feedback && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">📊 Feedback</h2>
          <p className="text-gray-700 whitespace-pre-line">{feedback}</p>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/interview")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
