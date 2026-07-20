import { signup } from "@/features/authentications/actions/signup";
import { JSX } from "react";
import { AuthenticationForm } from "./AuthenticationForm";
import "server-only";

export function SignupForm(): JSX.Element {
  async function signupUser(formData: FormData) {
    "use server";
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

  const formValues = {
    action: signupUser,
    inputFields: [
      { name: "user_id", type: "text", label: "User ID" },
      { name: "name", type: "text", label: "User Name" },
      { name: "email", type: "email", label: "Email" },
      { name: "password", type: "password", label: "Password" },
    ],
    buttonText: "登録",
  };

  return (
    <div className="dark:bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        ユーザー登録
      </h1>
      <AuthenticationForm {...formValues} />;
    </div>
  );
}
