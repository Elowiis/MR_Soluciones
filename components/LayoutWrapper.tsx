"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const isStudioRoute =
    pathname === "/studio" || pathname?.startsWith("/studio/");

  if (isStudioRoute) {
    
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="w-full min-w-full pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}


