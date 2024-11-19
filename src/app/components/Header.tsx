import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center px-6">
        {/* Logo Section */}
        <div className="flex items-center py-2">
          <Image
            src="/images/logo.png"
            alt="Greenopia Logo"
            width={187}
            height={46}
            priority
          />
        </div>
        {/* Navigation */}
        <nav className="pl-[22px] text-[14px] font-inter pt-2">
          <ul className="flex space-x-6">
            <li className="relative group px-6">
              <a href="#" className="font-bold leading-[53px] text-[#589D2CFF]">
                Home
              </a>
              {/* underline */}
              <div className="absolute left-0 bottom-0 h-[4px] bg-[#589D2CFF] rounded w-full"></div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
