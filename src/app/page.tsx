'use client';
import Card from "./components/Cards/CardProfile"
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card  />
      </div>
    </main>
  );
}
