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
    // 1. Чистий білий фон (або дуже світло-сірий) та легка тінь/тонка рамка
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm flex justify-center items-center border-b border-gray-200">
      
      {/* Прибираємо pb-4, щоб зробити хедер більш компактним. Використовуємо py-4 у нав. */}
      <nav className="relative flex justify-between items-center text-base w-full container px-4 sm:px-8 py-4">
        
        {/* Лого */}
        <div className="flex">
          {/* Текст лого: чорний, іконка: сіра або чорна */}
          <Link href="/" className="flex gap-1 items-center text-2xl font-extrabold text-gray-900">
            {/* Зменшуємо розмір іконки та робимо її менш домінуючою */}
            <Drone size={30} className="text-gray-600" /> 
            <span className="hidden sm:inline">FPVmaster</span>
            {/* Або залишаємо лише іконку на мобільних пристроях */}
          </Link>
        </div>

        {/* Навігація (тільки на великих екранах) */}
        {/* Посилання: сірий hover, чіткий шрифт */}
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

        {/* Поле пошуку (закоментовано, але залишаємо структуру) */}
        <div className="items-center hidden lg:flex">
          {/* <SearchDialog /> */}
        </div>

        {/* Іконки справа */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Мобільне меню: іконка сіра */}
            <MobileMenu categories={categories} />
            
            {/* Кошик: іконка сіра */}
            <CartIcon />
          </div>
        </div>
      </nav>
    </header>
  );
};