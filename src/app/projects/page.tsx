'use client';
import {NextUIProvider} from "@nextui-org/react";
import Card from "../components/Cards/CardProject"
import Navbar from "../components/Navbar"
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function Projects() {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="flex justify-center">
      <Card />
      </div>
    </main>
    </NextThemesProvider>
    </NextUIProvider>
  );
}
