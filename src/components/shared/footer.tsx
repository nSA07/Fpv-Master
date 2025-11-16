import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Footer: React.FC = () => {

  return (
    <footer className="w-full bg-white border-t py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex gap-1 items-center text-2xl font-extrabold text-gray-900">
          <Image src="/logo.png" alt="Logo" width={140} height={45} />
        </Link>
        
        <div className="bg-black/60 rounded-md">
          <Image src="/visa_platabymono.avif" alt="Logo" width={110} height={30} />
        </div>
       
      </div>
    </footer>
  );
};
