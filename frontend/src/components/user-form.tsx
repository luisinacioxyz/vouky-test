"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Loader2, CheckCircle2, AlertCircle, Tag } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api";

const userSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    userType: z.string().uuid("Tipo de usuário inválido (deve ser um GUID)"),
});

const USER_TYPES = [
    { id: "00a94b8e-6701-447a-9cf7-9a84594c4838", label: "Usuário Comum" },
    { id: "8f828741-9430-4e3e-a185-1153118cf972", label: "Administrador" },
    { id: "1e127339-e932-44f2-9844-469b89793540", label: "Suporte Técnico" },
];

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

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
        try {
            await apiClient.post("/users", data);

            setStatus("success");
            setMessage("Usuário cadastrado com sucesso!");
            reset();
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            setStatus("error");
            if (error instanceof ApiError) {
                setMessage(error.detail || "Erro ao cadastrar usuário.");
            } else {
                setMessage("Erro de conexão com o servidor.");
            }
        }
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
                    {status !== "idle" && status !== "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${status === "success"
                                ? "bg-green-50 border border-green-100 text-green-700"
                                : "bg-red-50 border border-red-100 text-red-700"
                                }`}
                        >
                            {status === "success" ? (
                                <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
                            ) : (
                                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                            )}
                            <div className="text-sm">
                                <p className="font-semibold">{status === "success" ? "Sucesso!" : "Ops!"}</p>
                                <p className="opacity-90">{message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
