'use client'

import Navbar from './_components/navbar';
import './globals.css';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import Aos from 'aos';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body className="bg-[#0b0b0f] text-white w-full min-h-screen m-0 p-0 overflow-x-hidden">
        <Navbar />
        <main className="w-full m-0 p-0">
          {children}
        </main>
      </body>
    </html>
  );
}