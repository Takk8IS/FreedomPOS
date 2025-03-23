"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            try {
                // Verificar se o usuário está autenticado
                const supabase = createClientComponentClient();
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                
                console.log("Verificando autenticação na página inicial...");
                
                if (sessionError) {
                    console.error("Erro ao verificar sessão:", sessionError);
                    router.push("/login");
                    return;
                }
                
                if (sessionData.session) {
                    console.log("Usuário autenticado, redirecionando para dashboard");
                    router.push("/dashboard");
                } else {
                    console.log("Usuário não autenticado, redirecionando para login");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthAndRedirect();
    }, [router]);

    // Exibir um indicador de carregamento enquanto verifica a autenticação
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    // Esta parte normalmente não será renderizada, pois o redirecionamento ocorrerá antes
    return null;
}
