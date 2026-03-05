"use client";

import { useState } from "react";
import { Search, Loader2, User, Calendar, Mail, Tag, XCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, ApiError } from "@/lib/api";
import { getUserType } from "@/lib/constants";
import { useToast } from "./ui/toast";
import { ConfirmationModal } from "./ui/confirmation-modal";

interface UserData {
    id: string;
    name: string;
    email: string;
    userType: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export function UserSearch() {
    const [searchId, setSearchId] = useState("");
    const [user, setUser] = useState<UserData | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setStatus("loading");

        setErrorVisible(false);

        try {
            const data = await apiClient.get<UserData>(`/users/${searchId}`);
            setUser(data);
            setStatus("idle");
        } catch (err) {
            setUser(null);
            setStatus("error");
            setErrorVisible(true);
        }
    };

    const confirmDelete = () => {
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!user || isDeleting) return;

        setIsDeleting(true);
        try {
            await apiClient.delete(`/users/${user.id}`);
            toast({
                type: "success",
                title: "Usuário Excluído",
                description: `O usuário ${user.name} foi removido com sucesso.`
            });
            setUser(null);
            setSearchId("");
            setIsModalOpen(false);
        } catch (err) {
            toast({
                type: "error",
                title: "Erro ao Excluir",
                description: "Não foi possível excluir o usuário."
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="w-full max-w-md mx-auto space-y-6">
            <div className="glass p-8 rounded-2xl shadow-sm border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-secondary text-secondary-foreground rounded-lg border border-border">
                        <Search size={20} />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Buscar Usuário</h2>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="w-full pl-12 pr-32 py-4 bg-white/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 font-mono text-sm"
                        placeholder="Insira o ID (GUID)"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        {status === "loading" ? <Loader2 className="animate-spin" size={16} /> : "Buscar"}
                    </button>
                </form>

                <AnimatePresence>
                    {errorVisible && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 flex items-center gap-2 text-destructive text-sm"
                        >
                            <XCircle size={16} />
                            <span>Usuário não encontrado ou ID inválido.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {user && (
                    <motion.div
                        key="user-card"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-border p-6 rounded-2xl shadow-xl shadow-primary/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <User size={120} />
                        </div>

                        <div className="space-y-4 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                                    <p className="text-xs font-mono text-muted-foreground">{user.id}</p>
                                </div>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                                    title="Excluir Usuário"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-dashed border-border">
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Mail size={14} className="text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Tag size={14} className="text-muted-foreground" />
                                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getUserType(user.userType).color} font-medium`}>
                                        {getUserType(user.userType).label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                    <Calendar size={12} />
                                    <span>Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {user && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                    isDestructive
                    title="Excluir Usuário"
                    description={`Você está prestes a realizar a exclusão do usuário "${user.name}". Ele não será mais retornado em buscas ativas. Deseja continuar?`}
                    confirmText="Sim, excluir"
                    cancelText="Voltar"
                />
            )}
        </section>
    );
}
