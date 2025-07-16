"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  if (user) return null; // Hide header if logged in

  return (
    <header className="w-full flex justify-end items-center px-8 py-4 bg-transparent z-20">
      <div className="space-x-2">
        <Link href="/login">
          <Button variant="outline" className="rounded-lg border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors">Login</Button>
        </Link>
        <Link href="/signup">
          <Button className="rounded-lg bg-amber-500 text-black hover:bg-amber-600 transition-colors">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
} 