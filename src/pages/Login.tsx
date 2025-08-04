import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-3 py-2 border rounded outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded outline-none"
          />
          <button className="w-full bg-black text-white py-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-blue-600 underline">
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}
