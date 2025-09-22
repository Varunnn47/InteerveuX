import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (forgotPassword) {
      alert(`Password reset link sent to ${email}`);
      setForgotPassword(false);
      return;
    }

    if (isRegister) {
      // Register logic → call backend API
      const user = { name, email };
      login(user);
      alert("Registration successful!");
      navigate("/dashboard");
    } else {
      // Login logic → call backend API
      const user = { name: "John Doe", email }; // Example user
      login(user);
      alert("Login successful!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          {forgotPassword ? "Forgot Password" : isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && !forgotPassword && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border rounded"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded"
            required
          />

          {!forgotPassword && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded"
              required
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            {forgotPassword ? "Reset Password" : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 flex justify-between">
          {!forgotPassword && (
            <button
              className="underline hover:text-blue-600"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </button>
          )}
          {!isRegister && (
            <button
              className="underline hover:text-blue-600"
              onClick={() => setForgotPassword(!forgotPassword)}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
