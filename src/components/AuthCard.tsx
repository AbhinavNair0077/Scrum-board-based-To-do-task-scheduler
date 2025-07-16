import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from "react";

interface AuthCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="flex justify-center items-center min-h-screen"
  >
    <Card className="w-full max-w-md shadow-lg rounded-xl border border-gray-200 bg-white">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-2xl font-bold text-center text-gray-800">{title}</CardTitle>}
          {description && <CardDescription className="text-center text-gray-500 mt-2">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);

export default AuthCard; 