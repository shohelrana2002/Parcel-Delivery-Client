import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import SocialLogin from "../SocialLogin/SocialLogin";
import ImageUpload from "../../../Hooks/ImageUpload";
import useSaveUser from "../../../Hooks/useSaveUser";
import { Helmet } from "@dr.pogodin/react-helmet";

const Register = () => {
  const saveUser = useSaveUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const from = location?.state?.from || "/";
  const { handleRegister, handleEmailVerify, handleLogOut, updateUserInfo } =
    useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password", "");

  const handleLogin = async (data) => {
    setLoading(true);

    const res = await handleRegister(data.email, data.password);
    try {
      const imageFile = data.image[0];
      await handleEmailVerify(res.user);
      const img = await ImageUpload(imageFile);
      const userInfo = {
        displayName: data.name,
        photoURL: img.data.url,
      };
      await updateUserInfo(userInfo);
      await saveUser(data.email);
      toast.success("Check Yor Gmail and Verify Account");
      await handleLogOut();
      navigate(from);
    } catch (err) {
      toast.error(err?.message);
      setLoading(false);
    } finally {
      setLoading(false);
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
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              {...register("name", {
                required: "Name is required",
              })}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/*file image upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Enter Your Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                className={`w-full px-4 py-2 border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          </div>
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
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={show ? "text" : "password"}
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
            <div
              onClick={() => setShow(!show)}
              className="absolute top-[38px] right-4 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
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
            disabled={loading}
            className="btn w-full btn-primary text-secondary"
          >
            {loading ? "Loading..." : " Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
