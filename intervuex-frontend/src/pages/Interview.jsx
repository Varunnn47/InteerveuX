import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function Interview() {
  const navigate = useNavigate();
  const [hrQs, setHrQs] = useState([]);
  const [codingQs, setCodingQs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const [isCodingPhase, setIsCodingPhase] = useState(false);
  const [codeResult, setCodeResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Load AI questions from localStorage
  useEffect(() => {
    const hr = localStorage.getItem("hrQuestions");
    const coding = localStorage.getItem("codingQuestions");

    if (hr) setHrQs(JSON.parse(hr));
    if (coding) setCodingQs(JSON.parse(coding));

    if (hr && JSON.parse(hr).length > 0) {
      speakQuestion(JSON.parse(hr)[0]);
    }
  }, []);

  // TTS (AI asks questions)
  const speakQuestion = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // Start STT
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) =>
      setTextAnswer(event.results[0][0].transcript);
    recognitionRef.current = recognition;
    recognition.start();

    setRecording(true);
  };

  // Stop STT
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      saveHrAnswer(blob, textAnswer);
    };
    recognitionRef.current.stop();
    setRecording(false);
  };

  const saveHrAnswer = (audioBlob, transcript) => {
    const newAnswers = [
      ...answers,
      { type: "hr", question: hrQs[current], audio: audioBlob, text: transcript },
    ];
    setAnswers(newAnswers);
  };

  // Submit code to Judge0
  const submitCode = async () => {
    if (!codeAnswer.trim()) return alert("Enter code before submitting!");

    try {
      const res = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: codeAnswer,
          language_id: 63, // JS example, later backend decides
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

      const newAnswers = [
        ...answers,
        {
          type: "coding",
          question: codingQs[current],
          code: codeAnswer,
          result: res.data,
        },
      ];
      setAnswers(newAnswers);
      setCodeAnswer("");
      setCodeResult(res.data);

      if (current + 1 < codingQs.length) {
        setCurrent(current + 1);
      } else {
        // Store in localStorage until backend integration
        localStorage.setItem("interviewAnswers", JSON.stringify(newAnswers));
        navigate("/results");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting code");
    }
  };

  // Handle next HR question
  const handleNextHr = () => {
    if (!textAnswer.trim() && !recording)
      return alert("Answer before continuing!");
    if (recording) stopRecording();
    setTextAnswer("");

    if (current + 1 < hrQs.length) {
      const nextQ = hrQs[current + 1];
      setCurrent(current + 1);
      speakQuestion(nextQ);
    } else {
      // All HR questions done → start coding phase
      setCurrent(0);
      setIsCodingPhase(true);
      alert("HR Round completed! Click OK to start Coding Interview.");
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
        {/* Webcam (always visible) */}
        <div className="md:w-1/2 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">🎥 Webcam Preview</h3>
          <Webcam
            audio={false}
            mirrored={true}
            className="rounded-lg shadow-md border w-full h-72"
          />
        </div>

        {/* Q&A / Coding */}
        <div className={`md:w-1/2 ${!isCodingPhase ? "" : "md:ml-auto"}`}>
          {!isCodingPhase ? (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                HR Round
              </h2>
              <p className="text-lg font-medium mb-2">
                Question {current + 1} of {hrQs.length}:
              </p>
              <p className="mb-4 text-gray-700 font-semibold">
                {hrQs[current]}
              </p>

              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-28 p-3 border border-gray-300 rounded-lg mb-4"
              />

              <div className="flex gap-4 mb-4">
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-lg ${
                    recording
                      ? "bg-red-600 text-white"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {recording ? "Stop Answer" : "Start Answer"}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextHr}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {current + 1 < hrQs.length
                    ? "Next ➡️"
                    : "Start Coding Phase 💻"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                💻 Coding Round
              </h2>
              <p className="text-lg font-medium mb-2">
                Coding Question {current + 1} of {codingQs.length}:
              </p>
              <p className="mb-4 text-gray-700 font-semibold">
                {codingQs[current].title}
              </p>

              <Editor
                height="300px"
                language={codingQs[current].language}
                value={codeAnswer}
                onChange={(value) => setCodeAnswer(value)}
                defaultValue={codingQs[current].starterCode}
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={submitCode}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Code
                </button>
              </div>

              {codeResult && (
                <div className="mt-4 p-4 bg-gray-50 border rounded">
                  <p>
                    <strong>Status:</strong> {codeResult.status.description}
                  </p>
                  <p>
                    <strong>Output:</strong> {codeResult.stdout || "N/A"}
                  </p>
                  <p>
                    <strong>Errors:</strong> {codeResult.stderr || "N/A"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
