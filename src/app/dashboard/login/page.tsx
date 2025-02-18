// components/LoginForm.tsx
"use client";
import { BASE_URL } from "@/app/api";
import axios, { AxiosError } from "axios";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}auth`, {
        username,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;

        // Store the token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
        }
        alert("Login successful!");
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        setError("Invalid credentials");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle general Error (without response)
        setError("Failed to login");
      } else if (err instanceof AxiosError) {
        // Handle AxiosError (with response)
        setError(err.response?.data?.message || "Failed to login");
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Input */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
