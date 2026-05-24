import { JSX } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { SignoutForm } from "@/components/SignoutForm";

export async function HeaderNav(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("access_token");

  return (
    <nav className="flex space-x-8">
      {hasToken ? <LoggedInNav /> : <GuestNav />}
    </nav>
  );
}

async function LoggedInNav(): Promise<JSX.Element> {
  return <SignoutForm />;
}

function GuestNav(): JSX.Element {
  return (
    <>
      <Link href="/signin" className="text-gray-300 hover:text-white">
        サインイン
      </Link>
      <Link href="/signup" className="text-gray-300 hover:text-white">
        新規登録
      </Link>
    </>
  );
}
