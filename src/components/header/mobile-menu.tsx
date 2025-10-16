'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu } from "lucide-react";
import Link from "next/link";

export const MobileMenu: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <Sheet>
      {/* Іконка відкриття меню */}
      <SheetTrigger className="lg:hidden inline-block">
        <Menu size={30} />
      </SheetTrigger>

      {/* Контент шторки */}
      <SheetContent
        side="right"
        className="
          bg-white
          p-3
          w-full
          sm:w-[70%]
          md:w-[50%]
          max-w-[600px]
          transition-all duration-300
          flex flex-col
        "
      >
        {/* Заголовок */}
        <SheetHeader className="border-b border-gray-200 pb-2">
          <SheetTitle className="text-base font-semibold">Меню</SheetTitle>
        </SheetHeader>

        {/* Скрол-контейнер */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-3 pr-2">
          {/* Категорії в акордеоні */}
          <Accordion type="single" collapsible className="w-full mb-0">
            <AccordionItem value="categories">
              <AccordionTrigger className="text-sm font-medium p-0">
                Категорії
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/${cat.id}`}
                        className="block py-1 px-2 rounded hover:bg-gray-100 text-sm"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Інші посилання */}
          <div className="flex flex-col space-y-1 pt-2">
            <Link href="/dostavka-i-oplata" className="hover:underline text-sm font-medium">
              Доставка і оплата
            </Link>
            <Link href="/sale" className="hover:underline text-sm font-medium">
              Знижки
            </Link>
            <Link href="/contacts" className="hover:underline text-sm font-medium">
              Контакти
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
