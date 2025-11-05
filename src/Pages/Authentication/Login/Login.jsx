import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");
  const { handleLoginAuth } = useAuth();
  const handleLogin = async (data) => {
    const fetch = await handleLoginAuth(data.email, data.password);
    try {
      if (!fetch.user.emailVerified) {
        return toast.err("plz verified your gmail");
      }
      toast.success("login successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.message);
    }
  };
  const conditions = [
    {
      label: "At least 6 characters",
      isValid: password.length >= 6,
    },
    {
      label: "At least one uppercase letter (A-Z)",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "At least one number (0-9)",
      isValid: /\d/.test(password),
    },
    {
      label: "At least one special character (@, $, !, %, *, ?, &)",
      isValid: /[@$!%*?&]/.test(password),
    },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                maxLength: {
                  value: 20,
                  message: "Password cannot be longer than 20 characters",
                },
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must be at least 6 characters, include 1 uppercase, 1 number & 1 special character",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="hover:underline hover:text-secondary">
            <Link>Forget Password?</Link>
          </div>
          {password && (
            <ul className="mt-3 space-y-1 text-sm">
              {conditions.map((cond, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2 ${
                    cond.isValid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  <span>{cond.isValid ? "✅" : "❌"}</span>
                  {cond.label}
                </li>
              ))}
            </ul>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-full bg-secondary text-primary"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            {" "}
            Register{" "}
          </Link>
          Now
        </p>
      </div>
    </div>
  );
};

export default Login;
