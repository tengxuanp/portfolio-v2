'use client';
import {NextUIProvider} from "@nextui-org/react";
import Card from "../components/Cards/CardCert"
import Navbar from "../components/Navbar"
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function Certifications() {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <main className="text-foreground bg-background h-screen">
      <Navbar />
      <div className="flex justify-center">
      <Card />
      </div>
    </main>
    </NextThemesProvider>
    </NextUIProvider>
  );
}
