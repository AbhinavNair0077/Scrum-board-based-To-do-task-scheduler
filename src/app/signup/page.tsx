"use client";
import React, { useState, useEffect } from "react";
import AuthCard from "@/components/AuthCard";
import AuthInput from "@/components/AuthInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; submit?: string }>({});
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
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!form.name) errs.name = "Full Name is required";
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
    
    // Check if email already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    
    if (existingUser?.user) {
      setLoading(false);
      setErrors({ submit: "An account with this email already exists. Please login instead." });
      return;
    }
    
    const { name, email, password } = form;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    setLoading(false);
    if (error) {
      setErrors({ submit: error.message });
      console.error("Signup error:", error.message);
    } else {
      setForm({ name: "", email: "", password: "" });
      setErrors({});
      console.log("Signup success", data);
      // Redirect to main page after successful signup
      router.push('/');
    }
  };

  return (
    <AuthCard title="Sign Up" description="Create your account to get started.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        {errors.submit && <div className="text-red-500 text-sm mb-2">{errors.submit}</div>}
        <Button
          type="submit"
          className="w-full mt-2 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          Sign Up
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-600 hover:underline font-medium">Login</Link>
      </div>
    </AuthCard>
  );
};

export default SignupPage; 