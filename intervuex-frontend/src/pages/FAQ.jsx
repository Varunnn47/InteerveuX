

export default function FAQ() {
  return (
    <div>
      <div className="max-w-4xl mx-auto mt-28 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="font-semibold">❓ What is IntervueX?</h3>
            <p>IntervueX is an AI-powered mock interview assistant with resume analysis, coding tests, and feedback.</p>
          </div>

          <div>
            <h3 className="font-semibold">❓ Do I need to create an account?</h3>
            <p>You can explore the platform without login, but uploading resumes, taking interviews, and saving results require registration.</p>
          </div>

          <div>
            <h3 className="font-semibold">❓ Which roles are supported?</h3>
            <p>Currently, software engineering, frontend, backend, and data science roles are supported. More coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
