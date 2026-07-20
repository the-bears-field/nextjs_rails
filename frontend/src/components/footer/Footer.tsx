import { JSX } from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-gray-800 text-white fixed bottom-0 left-0 w-full p-4">
      <div className="flex justify-center">
        <p>copyright © 2026 The Bears Field. All rights reserved.</p>
      </div>
    </footer>
  );
}
