import React from "react";
import { cn } from '@/lib/utils';
import Image from "next/image";
import logo from "../../../public/logo.png";
interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<Props> = ({ className, width, height }) => {
  return (
    <div className={cn(
        'font-black text-black bg-white p-1  inline-flex gap-2 items-center',
        className
      )}
    >
      <Image src={logo} width={width || 35} height={height || 35} alt={"Logo"} />
      FPVmaster
    </div>
  );
};