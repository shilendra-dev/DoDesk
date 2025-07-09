import axios from "axios";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { useWorkspace } from "../../providers/WorkspaceContext"; // adjust path if needed
import Label from "../../shared/components/atoms/Label";
import Input from "../../shared/components/atoms/Input";
import { useForm } from "react-hook-form";
import FormField from "../../shared/components/molecules/FormField";

function LoginForm() {
  const navigate = useNavigate();
  const { initializeWorkspaces } = useWorkspace();
  // const [data, setData] = useState({ email: "", password: "" });
  // const [error, setError] = useState("");

  // const handleChange = (e) => {
  //   setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const redirectUser = (user) => {
    if (user && user.default_workspace_id) {
      navigate(`/${user.default_workspace_id}`);
    } else if (user) {
      navigate(`/createworkspace`);
    } else {
      setError("User data is missing or incorrect");
    }
  };

  const onSubmit = async (data) => {
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

      // if (err.response) {
      //   setError(err.response?.data?.message || "Something went wrong");
      // } else if (err.request) {
      //   setError("No response from the server");
      // } else {
      //   setError("Request setup error: " + err.message);
      // }
    }
  };

  return (
    <div className="rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Log In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="********"
            {...register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />

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
