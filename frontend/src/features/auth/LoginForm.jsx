import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../providers/WorkspaceContext"; // adjust path if needed
import Label from "../../shared/components/atoms/Label";
import Input from "../../shared/components/atoms/Input";


function LoginForm() {
  const navigate = useNavigate();
  const { initializeWorkspaces } = useWorkspace();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const redirectUser = (user) =>{
    if (user && user.default_workspace_id) {
      navigate(`/${user.default_workspace_id}`);
    } else if (user) {
      navigate(`/createworkspace`);
    } else {
      setError('User data is missing or incorrect');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await axios.post(
        "http://localhost:5033/api/login", //api call for login
        data
      );
  
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
      // Check if 'workspaces' exists and is an array


      initializeWorkspaces(res.data.workspaces); // 👈 set in context

      const user = res.data.user; // Assuming user info is in res.data.user

      redirectUser(user);
      //console.log(user.default_workspace_id);
     
    } catch (err) {
      console.error("Login error:", err);
  
      if (err.response) {
        setError(err.response?.data?.message || "Something went wrong");
      } else if (err.request) {
        setError("No response from the server");
      } else {
        setError("Request setup error: " + err.message);
      }
    }
  };
  

  return (
    <div className="rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Log In
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
