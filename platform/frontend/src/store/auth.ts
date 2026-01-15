import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    nome_completo: string;
    email: string;
    tipo_usuario: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => {
                set({ user, token });
            },
            logout: () => {
                set({ user: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Helper hook para pegar isAuthenticated calculado
export const useIsAuthenticated = () => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    return !!(token && user);
};
