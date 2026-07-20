"use client";

import { signin } from "@/features/authentications/actions/signin";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { AuthenticationForm } from "./AuthenticationForm";

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

  const formValues = {
    action: signinUser,
    inputFields: [
      { name: "email", type: "email", label: "Email" },
      { name: "password", type: "password", label: "Password" },
    ],
    buttonText: "サインイン",
  };

  return (
    <div className="dark:bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        サインイン
      </h1>
      <AuthenticationForm {...formValues} />
    </div>
  );
}
