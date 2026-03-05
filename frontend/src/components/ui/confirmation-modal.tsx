"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDestructive = false,
    isLoading = false
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md glass p-6 rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                <AlertTriangle size={24} />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl font-medium border border-border hover:bg-secondary transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all shadow-lg shadow-primary/10 hover:opacity-90 disabled:opacity-50 ${isDestructive ? 'bg-red-600 text-white shadow-red-600/10' : 'bg-primary text-primary-foreground'
                                    }`}
                            >
                                {isLoading ? "Processando..." : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
