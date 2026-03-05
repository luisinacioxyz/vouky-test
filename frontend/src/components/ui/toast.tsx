"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
}

interface ToastContextType {
    toast: (payload: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ type, title, description }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, title, description }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="pointer-events-auto"
                        >
                            <div className="glass shadow-2xl border border-border/50 p-4 rounded-2xl flex gap-3 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className={`mt-0.5 shrink-0 ${t.type === "success" ? "text-green-600" :
                                        t.type === "error" ? "text-red-600" : "text-blue-600"
                                    }`}>
                                    {t.type === "success" && <CheckCircle2 size={20} />}
                                    {t.type === "error" && <AlertCircle size={20} />}
                                    {t.type === "info" && <Info size={20} />}
                                </div>

                                <div className="flex-1 space-y-1 pr-6">
                                    <h4 className="text-sm font-bold text-foreground leading-tight">
                                        {t.title}
                                    </h4>
                                    {t.description && (
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {t.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="absolute top-4 right-4 text-muted-foreground/50 hover:text-foreground transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
