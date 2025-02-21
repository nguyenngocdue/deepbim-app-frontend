import React, { useState } from "react";
import SocialLogin from "./SocialLogin";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignupForm: React.FC = () => {
  // State management
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("User Data:", formData);
    // API call can be added here
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Your Account</h2>
      <p className="text-sm text-gray-600 text-center mb-4">to continue to Google</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            aria-label="First Name"
            className="w-1/2"
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            aria-label="Last Name"
            className="w-1/2"
          />
        </div>

        <Input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Email Address"
        />

        <Input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
          aria-label="Phone Number"
        />

        <div className="flex space-x-2">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-label="Password"
            className="w-1/2"
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-label="Confirm Password"
            className="w-1/2"
          />
        </div>

        <p className="text-xs text-gray-500">
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </p>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Next
        </Button>
      </form>

      <SocialLogin />

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Already have an account? <a href="/signin" className="text-blue-600 font-semibold">Sign In</a>
        </span>
      </div>
    </div>
  );
};

export default SignupForm;
