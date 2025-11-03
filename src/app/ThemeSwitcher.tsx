"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {Button} from "@nextui-org/react";
import { MdLightMode } from "react-icons/md";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <Button size="sm" color="default" variant="faded" isIconOnly onClick={toggleTheme}>
        <MdLightMode />
      </Button>  
    </div>
  );
}
