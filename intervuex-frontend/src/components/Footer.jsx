export default function Footer() {
  return (
    <footer className="bg-white border-t mt-4">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-600">
        <p className="text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-600">IntervueX</span>. All rights reserved.
        </p>
  <div className="space-x-4 mt-2 md:mt-0">
          <a href="/faq" className="hover:text-blue-600">FAQ</a>
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
        </div>
      </div>
    </footer>
  );
}
