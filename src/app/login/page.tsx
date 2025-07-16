"use client";
import React, { useState, useEffect } from "react";
import AuthCard from "@/components/AuthCard";
import AuthInput from "@/components/AuthInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, submit: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    const { email, password } = form;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrors({ submit: error.message });
      console.error("Login error:", error.message);
    } else {
      setForm({ email: "", password: "" });
      setErrors({});
      console.log("Login success", data);
      // Redirect to main page after successful login
      router.push('/');
    }
  };

  return (
    <AuthCard title="Login" description="Welcome back! Please login to your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />
        {errors.submit && <div className="text-red-500 text-sm mb-2">{errors.submit}</div>}
        <Button
          type="submit"
          className="w-full mt-2 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          Login
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        New here?{' '}
        <Link href="/signup" className="text-amber-600 hover:underline font-medium">Create an account</Link>
      </div>
    </AuthCard>
  );
};

export default LoginPage; 