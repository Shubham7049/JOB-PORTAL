import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../../../utils/constant.js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/authSlice.js";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const { loading, user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle text inputs
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile image
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] || null;

    setInput({
      ...input,
      file,
    });

    console.log("Selected file:", file);
  };

  // Submit signup form
  const submitHandler = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    // Basic validation
    if (!input.role) {
      toast.error("Please select Student or Recruiter");
      return;
    }

    if (!input.file) {
      toast.error("Please select a profile image");
      return;
    }

    const formData = new FormData();

    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("file", input.file);

    console.log("Sending registration request...");
    console.log("File:", input.file);

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Registration response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-400 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">
            Sign Up
          </h1>

          {/* Full Name */}
          <div>
            <Label>FullName</Label>

            <Input
              type="text"
              name="fullName"
              value={input.fullName}
              onChange={changeEventHandler}
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>

            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="example@gmail.com"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label>Phone Number</Label>

            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="9999999999"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>

            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter password"
              required
            />
          </div>

          {/* Role + Profile */}
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              
              {/* Student */}
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />

                <Label>Student</Label>
              </div>

              {/* Recruiter */}
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />

                <Label>Recruiter</Label>
              </div>
            </RadioGroup>

            {/* Profile Image */}
            <div className="flex items-center gap-2">
              <Label>Profile</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Signup Button */}
          {loading ? (
            <Button
              type="button"
              disabled
              className="w-full my-4"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4"
            >
              Signup
            </Button>
          )}

          {/* Login */}
          <span className="text-sm">
            Already have an Account?{" "}

            <Link
              to="/login"
              className="text-blue-600 text-sm"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;