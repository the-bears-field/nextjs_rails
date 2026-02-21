"use client";

import { signin } from "@/features/authentications/actions/signin";
import { redirect } from "next/navigation";
import { JSX } from "react";

export function SigninForm(): JSX.Element {
  async function signinUser(formData: FormData) {
    const result = await signin(formData);

    if (result.success) {
      redirect(`/${result.value.user_id}`);
    } else {
      for (const [key, value] of Object.entries(result.errors)) {
        console.log(key, value);
      }
    }
  }

  return (
    <form
      action={signinUser}
      className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        ログイン
      </h1>

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
          ログイン
        </button>
      </div>
    </form>
  );
}
