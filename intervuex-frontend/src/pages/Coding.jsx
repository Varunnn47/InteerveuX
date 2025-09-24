import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function Coding() {
  const navigate = useNavigate();
  const [codingQs, setCodingQs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [codeResult, setCodeResult] = useState(null);

  useEffect(() => {
    const coding = localStorage.getItem("codingQuestions");
    if (coding) setCodingQs(JSON.parse(coding));
  }, []);

  const submitCode = async () => {
    if (!codeAnswer.trim()) return alert("Write some code first!");

    try {
      const res = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: codeAnswer,
          language_id: codingQs[current]?.languageId || 63, // Default JS
          stdin: "",
        },
        {
          headers: {
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      setCodeResult(res.data);

      if (current + 1 < codingQs.length) {
        setCurrent(current + 1);
        setCodeAnswer("");
        setCodeResult(null);
      } else {
        navigate("/results");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting code");
    }
  };

  if (codingQs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">No coding questions loaded...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Coding Round
        </h2>

        <p className="text-lg font-medium mb-4">
          Question {current + 1} of {codingQs.length}:
        </p>
        <p className="mb-4 text-gray-700 font-semibold">
          {codingQs[current]?.title}
        </p>

        <Editor
          height="300px"
          language={codingQs[current]?.language || "javascript"}
          value={codeAnswer}
          onChange={(value) => setCodeAnswer(value)}
          defaultValue={codingQs[current]?.starterCode || ""}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={submitCode}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {current + 1 < codingQs.length ? "Next Question" : "Finish & View Results"}
          </button>
        </div>

        {codeResult && (
          <div className="mt-6 p-4 bg-gray-50 border rounded text-left">
            <p><strong>Status:</strong> {codeResult.status?.description}</p>
            <p><strong>Output:</strong> {codeResult.stdout || "N/A"}</p>
            <p><strong>Errors:</strong> {codeResult.stderr || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
