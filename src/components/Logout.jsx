import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://localhost:7034/api/Auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      dispatch(logout()); // Clear the user state in Redux
      navigate("/"); // Redirect to login page after logout
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <h2 className="text-xl font-bold">Logout</h2> */}
      {/* <button
        onClick={handleLogout}
        className="p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button> */}

      <button
        type="button"
        onClick={handleLogout}
        className={`px-4 py-2 font-medium rounded-lg shadow-md transition duration-300 
                    focus:outline-none focus:ring-2 cursor-pointer bg-blue-300 m-0.5 text-black`}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
