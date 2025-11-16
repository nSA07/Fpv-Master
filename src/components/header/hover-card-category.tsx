'use client';
import React from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
interface HoverCardCategoryProps {
  categories: Category[];
}

export const HoverCardCategory: React.FC<HoverCardCategoryProps> = ({categories}) => {

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger className="cursor-pointer hover:text-gray-600 font-medium transition-colors" asChild>
        <Link href="/">Категорії</Link>
      </HoverCardTrigger>

      <HoverCardContent
        forceMount
        className="
          w-64
          bg-white
          rounded-xl
          shadow-lg
          border
          p-3
        "
      >
        <div
          className="
            flex flex-col space-y-1
            max-h-64
            overflow-y-auto
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
          "
        >
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">немає категорій</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="block text-sm py-1 px-2 rounded hover:bg-gray-100 transition"
              >
                {cat.name}
              </Link>
            ))
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
