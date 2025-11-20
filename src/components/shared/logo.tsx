import React from "react";
import { cn } from '@/lib/utils';
import Image from "next/image";
import logo from "../../../public/logo.png";
interface Props {
  className?: string;
}

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(
        'font-black text-black bg-white p-1 px-3 border-2 inline-flex border-black gap-2 items-center',
        className
      )}
    >
      <Image src={logo} width={35} height={35} alt={"Logo"} />
      FPVmaster
    </div>
  );
};