"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Loader2, Tag, Copy, Check } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "./ui/toast";
import { USER_TYPES } from "@/lib/constants";

const userSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    userType: z.string().uuid("Tipo de usuário inválido (deve ser um GUID)"),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
    const [status, setStatus] = useState<"idle" | "loading">("idle");
    const [createdUserId, setCreatedUserId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            userType: USER_TYPES[0].id,
        },
    });

    const onSubmit = async (data: UserFormData) => {
        setStatus("loading");
        setCreatedUserId(null);
        try {
            const response = await apiClient.post<{ id: string }>("/users", data);

            toast({
                type: "success",
                title: "Sucesso!",
                description: "Usuário cadastrado com sucesso."
            });

            setCreatedUserId(response.id);
            setStatus("idle");
            reset();
        } catch (error) {
            setStatus("idle");
            if (error instanceof ApiError) {
                toast({
                    type: "error",
                    title: "Erro no cadastro",
                    description: error.detail || "Não foi possível cadastrar o usuário."
                });
            } else {
                toast({
                    type: "error",
                    title: "Erro de Conexão",
                    description: "Não foi possível conectar ao servidor."
                });
            }
        }
    };

    const copyToClipboard = () => {
        if (!createdUserId) return;
        navigator.clipboard.writeText(createdUserId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="w-full max-w-md mx-auto">
            <div className="glass p-8 rounded-2xl shadow-sm border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Novo Usuário</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Nome Completo</label>
                        <input
                            {...register("name")}
                            className="w-full px-4 py-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="Ex: Luis Inácio"
                        />
                        {errors.name && <p className="text-xs text-destructive ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">E-mail</label>
                        <input
                            {...register("email")}
                            className="w-full px-4 py-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="exemplo@email.com"
                        />
                        {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Tipo de Usuário</label>
                        <div className="relative group">
                            <select
                                {...register("userType")}
                                className="w-full px-4 py-3 bg-white/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                            >
                                {USER_TYPES.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Tag size={16} />
                            </div>
                        </div>
                        {errors.userType && <p className="text-xs text-destructive ml-1">{errors.userType.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === "loading" ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            "Cadastrar Usuário"
                        )}
                    </button>
                </form>

                <AnimatePresence>
                    {createdUserId && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-primary uppercase tracking-wider">ID do Novo Usuário</span>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary flex items-center gap-1.5 text-xs font-semibold"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? "Copiado" : "Copiar"}
                                </button>
                            </div>
                            <p className="font-mono text-[10px] break-all bg-white/50 p-2 rounded-lg border border-border/50 text-muted-foreground">
                                {createdUserId}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
