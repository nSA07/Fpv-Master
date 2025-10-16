import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={cn("mx-auto w-full sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1240px] px-4", className)}>
      {children}
    </div>
  );
};
