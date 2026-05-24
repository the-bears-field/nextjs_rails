"use client";

import { JSX } from "react";
import { useRouter } from "next/navigation";
import { signout } from "@/features/authentications/actions/signout";

export function SignoutForm(): JSX.Element {
  const router = useRouter();

  async function signoutUser() {
    await signout();
    router.push("/");
  }

  return (
    <form action={signoutUser}>
      <button
        type="submit"
        className="text-gray-300 cursor-pointer hover:text-white"
      >
        サインアウト
      </button>
    </form>
  );
}
