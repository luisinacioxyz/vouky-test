export const USER_TYPES = [
    { id: "00a94b8e-6701-447a-9cf7-9a84594c4838", label: "Usuário Comum", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { id: "8f828741-9430-4e3e-a185-1153118cf972", label: "Administrador", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { id: "1e127339-e932-44f2-9844-469b89793540", label: "Suporte Técnico", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export function getUserType(id: string) {
    return USER_TYPES.find(t => t.id === id) || { label: "Desconhecido", color: "bg-gray-50 text-gray-700 border-gray-200" };
}
