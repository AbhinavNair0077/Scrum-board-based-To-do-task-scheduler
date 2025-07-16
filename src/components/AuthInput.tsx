import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AuthInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, type, name, value, onChange, error, autoComplete }) => (
  <div className="mb-4">
    <Label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default AuthInput; 