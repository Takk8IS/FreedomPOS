import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './types';

// Crie e exporte uma instância do cliente Supabase
export const supabase = createClientComponentClient<Database>();

// Função auxiliar para verificar se o Supabase está configurado corretamente
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('system_settings').select('*').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão com o Supabase:', error);
    return false;
  }
}