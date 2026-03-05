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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary border border-border text-xs font-semibold uppercase tracking-widest mb-2"
          >
            <ShieldCheck size={14} />
            <span>Vouky Administration</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1]">
            Gestão de <span className="text-muted-foreground/30 italic">Usuários</span>
          </h1>

          <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
            Interface administrativa premium para controle de acessos e monitoramento de identidades.
          </p>
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
            <div className="flex items-center gap-2 text-muted-foreground/60 mb-2">
              <Zap size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Cadastro Rápido</span>
            </div>
            <UserForm />
          </motion.div>

          {/* Right Column: Search & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground/60 mb-2">
              <Users size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Consulta de Dados</span>
            </div>
            <UserSearch />

            {/* Info Card */}
            <div className="glass p-6 rounded-2xl border border-border/30 bg-white/30 text-sm text-muted-foreground/80 leading-relaxed">
              <p>
                <strong>Dica:</strong> Utilize o GUID gerado no cadastro para realizar buscas rápidas.
                O sistema implementa <em>Soft Delete</em> nativo para garantir a integridade dos dados históricos.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="pt-20 border-t border-border/40 text-center">
          <p className="text-xs font-mono text-muted-foreground opacity-50 uppercase tracking-widest">
            Vouky User Management System &copy; 2026 • Powered by .NET & Next.js
          </p>
        </footer>

      </div>
    </main>
  );
}
