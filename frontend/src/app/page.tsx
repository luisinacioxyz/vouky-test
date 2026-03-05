"use client";

import { UserForm } from "@/components/user-form";
import { UserSearch } from "@/components/user-search";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen ivory-gradient selection:bg-primary selection:text-primary-foreground py-12 px-4 md:py-24">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Header Section */}
        <header className="text-center space-y-4 max-w-2xl mx-auto animate-in">

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
            Gestão de <span className="text-muted-foreground/30 italic">Usuários</span>
          </h1>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <UserForm />
          </motion.div>

          {/* Right Column: Search & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <UserSearch />
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="pt-20 border-t border-border/40 text-center">
          <p className="text-xs font-mono text-muted-foreground opacity-50 uppercase tracking-widest">
            Vouky User Management System &copy;
          </p>
        </footer>

      </div>
    </main>
  );
}
