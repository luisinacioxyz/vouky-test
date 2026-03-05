/**
 * Centralized API client for the User Management System.
 * Implements a typed fetch wrapper with standardized error handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5052";

export class ApiError extends Error {
    constructor(public status: number, public message: string, public detail?: string) {
        super(message);
        this.name = "ApiError";
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorDetail = "Erro desconhecido";
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorData.title || errorDetail;
        } catch {
            // Use fallback if JSON parsing fails
        }
        throw new ApiError(response.status, `API Error: ${response.status}`, errorDetail);
    }

    if (response.status === 204) return {} as T;
    return response.json();
}

export const apiClient = {
    async get<T>(path: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return handleResponse<T>(response);
    },

    async post<T>(path: string, data: any): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse<T>(response);
    },

    async delete(path: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        await handleResponse<void>(response);
    },
};
