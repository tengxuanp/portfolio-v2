'use client';
import {NextUIProvider} from "@nextui-org/react";
import PostsManager from "../components/PostsManagerNew"
import Navbar from "../components/Navbar"
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function Posts() {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PostsManager />
      </div>
    </main>
    </NextThemesProvider>
    </NextUIProvider>
  );
}
