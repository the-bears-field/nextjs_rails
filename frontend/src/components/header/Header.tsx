import { JSX } from "react";
import { HeaderNav } from "./HeaderNav";
import Link from "next/link";

export function Header(): JSX.Element {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className=" flex items-center justify-between mx-8">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
