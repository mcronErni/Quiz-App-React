import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Cookies from "js-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7034/api/Auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameEmail: username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      Cookies.set("role", data.role);
      Cookies.set("mentorId", data.mentorId || null);
      Cookies.set("bootcamperId", data.bootcamperId || null);
      Cookies.set("mentorName", data.mentorName || null);
      Cookies.set("bootcamperName", data.bootcamperName || null);

      dispatch(login());

      navigate(data.role === "mentor" ? "/mentor" : "/user");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex bg-slate-200 flex-row items-center justify-center">
        <div className="bg-indigo-400 rounded-3xl flex flex-col items-center gap-4 p-6">
          <h2 className="text-xl text-white font-bold">Login</h2>
          {error && <p className="text-white">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">
            <input type="text" placeholder="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white p-2 border-2 border-slate-300 rounded" required
            />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white p-2 border-2 border-slate-300 rounded" required
            />
            <button type="submit" className="p-2 bg-indigo-700 text-white rounded cursor-pointer">
              Login
            </button>
            <Button label={"Create a New Account"} navigateTo={"register"}/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;