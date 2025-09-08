import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useEffect } from "react";
import axios from "axios";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [email, password] = watch(["email", "password"]);

  useEffect(() => {
    if (user?.id) {
      navigate("/dashboard");
    }
    clearErrors("loginError");
  }, [user, navigate, clearErrors, email, password]);

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3000/users/signin", data)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser({
          id: response.data._id,
          username: response.data.username,
        });
      })
      .catch((error) => {
        console.error("Sign In Error:", error);

        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Invalid username or password";

        setError("loginError", { message });
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 overflow-hidden">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login error */}
          {errors.loginError && (
            <p className="text-red-500 text-sm mt-2">
              {errors.loginError.message}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
          >
            Sign In
          </button>
        </form>

        {/* Sign-up link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
