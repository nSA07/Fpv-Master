import Link from "next/link";
import React from "react";
import { SearchDialog } from "./search-dialog";
import { Drone } from "lucide-react";
import { HoverCardCategory } from "./hover-card-category";
import { getCategories } from "@/lib/directus";
import { MobileMenu } from "./mobile-menu";
import { CartIcon } from "./cart";

export const Header: React.FC = async () => {
  const categories: Category[] = await getCategories();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5f5f7] flex justify-center items-center pb-4 border-b border-gray-200">
      <nav className="relative flex justify-between items-center text-base w-full mx-8 mt-4 h-14 container">
        
        {/* Лого */}
        <div className="flex">
          <Link href="/" className="flex gap-2 items-end text-2xl font-bold">
            <Drone size={45} />
            <span>FPVmaster</span>
          </Link>
        </div>

        {/* Навігація (тільки на великих екранах) */}
        <div className="items-center gap-3.5 h-3.5 hidden lg:flex">
          <HoverCardCategory categories={categories} />
          <Link className="hover:underline font-medium" href="/dostavka-i-oplata">
            Доставка і оплата
          </Link>
          <Link className="hover:underline font-medium" href="/sale">
            Знижки
          </Link>
          <Link className="hover:underline font-medium" href="/contacts">
            Контакти
          </Link>
        </div>

        {/* <div className="items-center hidden lg:flex">
          <SearchDialog />
        </div> */}

        {/* Іконки справа */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <MobileMenu categories={categories} />
            <CartIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};

