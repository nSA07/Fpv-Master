import React from "react";
import Link from "next/link";
// Припускаємо, що у вас є ці імпорти:
import { Separator } from "@/components/ui/separator"; // Для розділювальної лінії
import { Logo } from "./logo";

export const Footer: React.FC = () => {
  // Посилання для навігації в нижньому колонтитулі
  const footerLinks = [
    { title: "Повернення товару", href: "/return-policy" },
    { title: "Політика конфіденційності", href: "/privacy-policy" },
    { title: "Публічна оферта", href: "/public-offer" },
    { title: "Доставка і оплата", href: "/dostavka-i-oplata" },
    { title: "Контакти", href: "/contacts" },
  ];

  return (
    <footer className="w-ful border-t">
      {/* 1. Основна секція футера (3 колонки: Лого, Prom.ua, Telegram) */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* == Колонка 1: Логотип == */}
          <div className="flex flex-col space-y-4">
            {/* Використовуємо size="sm" для меншого логотипу у футері */}
            <Link href="/">
              <Logo
                className="text-lg"
              />
            </Link>
          </div>

          {/* == Колонка 2: Віджет Prom.ua == */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Наші відгуки</h4>
            {/*
              УВАГА: Тут має бути код вбудовування віджету Prom.ua.
              Його не можна відтворити чистим CSS, тому я залишаю заглушку.
            */}
            <div className="w-full h-24 bg-gray-100 border border-gray-300 flex items-center justify-center text-sm text-gray-500 rounded-md p-2">
              [Місце для віджета Prom.ua з відгуками]
              {/* Приклад: <iframe src="URL_ВАШОГО_ВІДЖЕТА" width="..." height="..."></iframe> */}
            </div>
          </div>

          {/* == Колонка 3: Telegram Блог == */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Наш блог</h4>
            <Link
              href="https://t.me/FPVmasterUA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:text-black/60 transition-all font-medium rounded-lg"
            >
              <img 
                src="/telegram.png" 
                alt="Telegram Icon" 
                className="w-6 h-6" 
              />
              <span className="group-hover:text-white">@FPVmasterUA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Секція копірайту та навігаційних посилань */}
      
      {/* Сепаратор Shadcn/ui */}
      <Separator className="bg-gray-200" /> 
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600 space-y-3 md:space-y-0">
          {/* Копірайт */}
          <span className="order-2 md:order-1">
            © {new Date().getFullYear()}, FPV master
          </span>
          
          {/* Навігаційні посилання */}
          <nav className="flex flex-wrap gap-x-4 gap-y-2 order-1 md:order-2 justify-start md:justify-end">
            {footerLinks.map((link) => (
              <Link 
                key={link.title} 
                href={link.href} 
                className="hover:text-black transition duration-150"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};