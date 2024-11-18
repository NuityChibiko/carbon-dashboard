"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    // <header className="bg-white shadow-sm">
    //   <div className="container mx-auto flex items-center justify-between py-4 px-6">
    //     {/* Logo Section */}
    //     <div className="flex items-center space-x-2">
    //       <Image
    //         src="/images/logo.png"
    //         alt="Greenopia Logo"
    //         className="h-8 w-auto"
    //         width={187}
    //         height={30}
    //       />
    //     </div>

    //     {/* Navigation Links */}
    //     <nav>
    //       <ul className="flex space-x-6">
    //         <li>
    //           <a
    //             href="#"
    //             className="text-green-700 hover:text-green-500 text-lg font-semibold"
    //           >
    //             Home
    //           </a>
    //         </li>
    //       </ul>
    //     </nav>
    //   </div>
    // </header>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost" title="Notifications">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
