'use client';

import { useState, useEffect } from 'react';
import Todo from '@/components/Todo';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-8 px-4 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#444,#444_1px,transparent_1px,transparent_10px)] bg-repeat"></div>
      <div className="relative z-10">
        <div className="flex justify-end items-center mb-8">
          {user && (
            <div className="text-right mr-4">
              <p className="text-amber-400 font-medium">{user.user_metadata?.full_name || user.email}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          )}
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900"
          >
            Logout
          </Button>
        </div>
        <Todo />
      </div>
    </div>
  );
}
