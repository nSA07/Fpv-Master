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
import { Menu } from "lucide-react";
import Link from "next/link";

export const MobileMenu: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden inline-block">
        <Menu size={30} />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-white p-3 w-full sm:w-[70%] md:w-[50%] max-w-[600px] flex flex-col"
      >
        <SheetHeader className="border-b border-gray-200 pb-2">
          <SheetTitle className="text-base font-semibold">
            <Link onClick={handleClose} href="/">Головна</Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-2 space-y-3 pr-2">
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
                        onClick={handleClose}
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

          <div className="flex flex-col space-y-1 pt-2">
            <Link href="/dostavka-i-oplata" onClick={handleClose} className="hover:underline text-sm font-medium">
              Доставка і оплата
            </Link>
            <Link href="/sale" onClick={handleClose} className="hover:underline text-sm font-medium">
              Знижки
            </Link>
            <Link href="/contacts" onClick={handleClose} className="hover:underline text-sm font-medium">
              Контакти
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
