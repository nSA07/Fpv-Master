'use client';

import { useState } from "react";
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
import { Menu, Home, Package, Percent, Phone, ChevronRight } from "lucide-react"; 
import Link from "next/link";

export const MobileMenu: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden inline-block p-1 text-gray-900">
        {/* Кнопка тригера чорного кольору */}
        <Menu size={24} /> 
      </SheetTrigger>

      <SheetContent
        side="left" 
        className="bg-white p-4 w-full sm:max-w-xs flex flex-col border-r border-gray-200"
      >
        <SheetHeader className="border-b border-gray-300 pb-4">
          <SheetTitle className="text-xl font-bold text-gray-900">
            <Link onClick={handleClose} href="/">
                FPV Master
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          
          {/* Блок основних посилань */}
          <div className="flex flex-col space-y-1 mb-4 border-b border-gray-100 pb-4">
            <Link 
              href="/" 
              onClick={handleClose} 
              className="flex items-center justify-between py-2 px-1 rounded hover:bg-gray-50 text-base font-medium text-gray-800"
            >
              <span className="flex items-center gap-3">
                <Home size={18} className="text-gray-500" />
                Головна
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link 
              href="/dostavka-i-oplata" 
              onClick={handleClose} 
              className="flex items-center justify-between py-2 px-1 rounded hover:bg-gray-50 text-base font-medium text-gray-800"
            >
              <span className="flex items-center gap-3">
                <Package size={18} className="text-gray-500" />
                Доставка і оплата
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link 
              href="/sale" 
              onClick={handleClose} 
              className="flex items-center justify-between py-2 px-1 rounded hover:bg-gray-50 text-base font-medium text-gray-800"
            >
              <span className="flex items-center gap-3">
                <Percent size={18} className="text-gray-500" />
                Знижки
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            <Link 
              href="/contacts" 
              onClick={handleClose} 
              className="flex items-center justify-between py-2 px-1 rounded hover:bg-gray-50 text-base font-medium text-gray-800"
            >
              <span className="flex items-center gap-3">
                <Phone size={18} className="text-gray-500" />
                Контакти
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </div>

          {/* Блок категорій (Accordion) */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories" className="border-b border-gray-300">
              <AccordionTrigger className="text-base font-bold text-gray-900 p-0 py-2 hover:bg-gray-50 hover:no-underline rounded">
                Каталог товарів
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-2">
                <ul className="space-y-1 pl-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/${cat.id}`}
                        onClick={handleClose}
                        className="block py-1 px-2 rounded hover:bg-gray-100 text-sm font-regular text-gray-700 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
        </div>
      </SheetContent>
    </Sheet>
  );
};