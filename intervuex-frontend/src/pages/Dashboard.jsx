import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]); // ✅ Always starts as array
  const navigate = useNavigate();

  useEffect(() => {
    // 🔒 Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // redirect if not logged in
      return;
    }
    setUser(JSON.parse(storedUser));

    // Fetch interview history from backend
    axios
      .get("/api/user/interviews") // replace with your backend API
      .then((res) => {
        // ✅ Ensure data is an array
        if (Array.isArray(res.data)) {
          setInterviews(res.data);
        } else {
          console.warn("Unexpected response:", res.data);
          setInterviews([]); // fallback
        }
      })
      .catch((err) => {
        console.error(err);
        setInterviews([]); // fallback in case of error
      });
  }, [navigate]);

  return (
    <div>
      <div className="max-w-6xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          👤 User Dashboard
        </h1>

        {user && (
          <div className="mb-8 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>
            <p>Total Interviews Attended: {interviews.length}</p>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">📝 Past Interviews</h2>

          {(!interviews || interviews.length === 0) && (
            <p>No interviews completed yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(interviews) &&
              interviews.map((interview, idx) => {
                const behavioralAnswers = interview.behavioralAnswers || [];
                const codingAnswers = interview.codingAnswers || [];
                const totalCoding = codingAnswers.length;
                const codingScore = codingAnswers.filter(
                  (c) => c?.result?.status?.id === 3
                ).length;

                const handleViewResults = () => {
                  try {
                    const allAnswers = [
                      ...behavioralAnswers,
                      ...codingAnswers,
                    ];
                    localStorage.setItem(
                      "interviewAnswers",
                      JSON.stringify(allAnswers)
                    );
                  } catch (e) {
                    console.error("Failed to save interview answers", e);
                  }
                  window.location.assign("/results");
                };

                return (
                  <div
                    key={idx}
                    className="p-4 border rounded bg-gray-50 shadow-sm"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {interview.date || `Interview ${idx + 1}`}
                    </h3>
                    <p>Total Behavioral Questions: {behavioralAnswers.length}</p>
                    <p>Total Coding Questions: {totalCoding}</p>
                    <p>
                      Coding Correctly Solved: {codingScore} / {totalCoding}
                    </p>
                    <p>
                      Overall Coding Success:{" "}
                      {totalCoding > 0
                        ? ((codingScore / totalCoding) * 100).toFixed(2)
                        : 0}
                      %
                    </p>
                    <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleViewResults}
                    >
                      View Results
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
