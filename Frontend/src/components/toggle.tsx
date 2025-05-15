'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
   <Button
   variant="outline" size="icon"
   onClick={()=>setTheme(theme==="light"?"dark":"light")}
   >
   {
    (theme==="light")?<Sun/>:<Moon/>
   }
   </Button>
  );
}
