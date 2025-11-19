import React from "react";
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(
        'font-black text-black bg-white p-1 px-3 border-2 border-black inline-block',
        className
      )}
    >
        FPVmaster
    </div>
  );
};