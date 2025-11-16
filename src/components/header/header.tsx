import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SearchDialog } from "./search-dialog";
import { HoverCardCategory } from "./hover-card-category";
import { getCategories } from "@/lib/directus";
import { MobileMenu } from "./mobile-menu";
import { CartIcon } from "./cart";

export const Header: React.FC = async () => {
  const categories: Category[] = await getCategories();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm flex justify-center items-center border-b border-gray-200">
      
      <nav className="relative flex justify-between items-center text-base w-full container px-4 sm:px-8 py-4">
        
        <div className="flex">
          <Link href="/" className="flex gap-1 items-center text-2xl font-extrabold text-gray-900">
            <Image src="/logo.png" alt="Logo" width={140} height={45} />
          </Link>
        </div>

        <div className="items-center gap-6 hidden lg:flex text-sm">
          
          <HoverCardCategory categories={categories} />
          
          <Link className="hover:text-gray-600 font-medium transition-colors" href="/dostavka-i-oplata">
            Доставка і оплата
          </Link>
          
          <Link className="hover:text-gray-600 font-medium transition-colors" href="/sale">
            Знижки
          </Link>
          
          <Link className="hover:text-gray-600 font-medium transition-colors" href="/contacts">
            Контакти
          </Link>
        </div>

        <div className="items-center hidden lg:flex">
          {/* <SearchDialog /> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MobileMenu categories={categories} />
            
            <CartIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};