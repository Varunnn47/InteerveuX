import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

export default function Interview() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [hrQs, setHrQs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const recognitionRef = useRef(null);

  // Load HR questions (from backend/localStorage for now)
  useEffect(() => {
    const hr = localStorage.getItem("hrQuestions");
    if (hr) setHrQs(JSON.parse(hr));
  }, []);

  // AI asks the question aloud
  const speakQuestion = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // Start voice recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const newAnswers = [
        ...answers,
        { question: hrQs[current], answer: transcript },
      ];
      setAnswers(newAnswers);

      // Move to next question automatically
      if (current + 1 < hrQs.length) {
        setCurrent((prev) => prev + 1);
        speakQuestion(hrQs[current + 1]);
        startListening(); // keep listening for next question
      } else {
        // All HR Qs finished
        localStorage.setItem("interviewAnswers", JSON.stringify(newAnswers));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const startInterview = () => {
    setStarted(true);
    if (hrQs.length > 0) {
      speakQuestion(hrQs[0]);
      startListening();
    }
  };

  const goToCoding = () => {
    navigate("/coding"); // separate coding page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg text-center">
      {!started ? (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-blue-600">
            Ready for your Mock Interview?
          </h1>
          <button
            onClick={startInterview}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            HR Round in Progress
          </h2>
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              mirrored={true}
              className="rounded-lg shadow-md border w-full h-72 mb-6"
            />
            <p className="text-lg text-gray-700">
              The interviewer is asking you questions...
            </p>
          </div>

          {current + 1 === hrQs.length && (
            <div className="mt-8">
              <button
                onClick={goToCoding}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Proceed to Coding Round
              </button>
            </div>
          )}
        </div>
          )}
      </div>
    </div>
  );
}
