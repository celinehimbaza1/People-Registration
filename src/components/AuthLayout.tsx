import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Explore the app</h1>
      <p className="text-gray-600 mb-6">
        Now your registration is in one place and always under control
      </p>
      <div className="flex gap-4">
        <button
          className="bg-black text-white py-2 px-6 rounded"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
        <button
          className="border border-black text-black py-2 px-6 rounded"
          onClick={() => navigate("/signup")}
        >
          Create account
        </button>
      </div>
    </div>
  );
}
