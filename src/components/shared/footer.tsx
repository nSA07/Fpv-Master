import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-100 border-t py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Ліва частина - соцмережі */}
        <div className="flex items-center gap-4 text-gray-600">
          <Link href="https://facebook.com" target="_blank">
            <Facebook className="w-5 h-5 hover:text-blue-600 transition-colors" />
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors" />
          </Link>
          <Link href="https://youtube.com" target="_blank">
            <Youtube className="w-5 h-5 hover:text-red-600 transition-colors" />
          </Link>
        </div>

        {/* Права частина - права захищені */}
        <p className="text-sm text-gray-500">© {year} Всі права захищені</p>
      </div>
    </footer>
  );
};
