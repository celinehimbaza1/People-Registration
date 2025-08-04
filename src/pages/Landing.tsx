import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl px-8 py-10 w-full max-w-md min-h-[450px] flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black mb-4">Explore the app</h1>
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            Now your people registration is in one place <br />
            and always under control
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-black text-white py-2 rounded-md text-base font-semibold hover:bg-gray-800 transition"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full border border-black text-black py-2 rounded-md text-base font-semibold hover:bg-gray-100 transition"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
