"use client";

import { signup } from "@/features/authentications/signup";
import { JSX } from "react";

export function SignupForm(): JSX.Element {
  async function signupUser(formData: FormData) {
    const result = await signup(formData);

    if (result.success) {
      for (const [key, value] of Object.entries(result.value)) {
        console.log(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(result.errors)) {
        console.log(key, value);
      }
    }
  }

  return (
    <form
      action={signupUser}
      className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        ユーザー登録
      </h1>

      {/* User ID Input */}
      <div className="mb-4">
        <label
          htmlFor="user_id"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          User ID
        </label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* User ID Input */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          User Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* Password Input */}
      <div className="mb-4 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          登録
        </button>
      </div>
    </form>
  );
}
