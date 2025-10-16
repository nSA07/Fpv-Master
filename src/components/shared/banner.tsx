import React from "react";
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Banner: React.FC<Props> = ({ className }) => {
  const images = [
    "https://i.pinimg.com/1200x/eb/f7/78/ebf7781edfc19689d1f8dafe955da01e.jpg",
    "https://i.pinimg.com/736x/ed/54/0c/ed540cb4d28fefdc6efcac05c9d2fb5f.jpg",
    "https://i.pinimg.com/736x/7f/54/aa/7f54aaa18c9e6222506ad45f8b65548c.jpg",
    "https://i.pinimg.com/736x/09/c9/92/09c9928e59353584d3dbf39908f6d489.jpg",
  ];

  return (
    <div
      className={cn(
        "mt-24 h-[300px] flex overflow-hidden",
        className
      )}
    >
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Banner ${idx + 1}`}
          className="h-full flex-1 object-cover"
        />
      ))}
    </div>
  );
};