export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  store_name?: string;
  reset_token?: string;
  reset_token_expires?: string;
  created_at: string;
  last_login?: string;
}

export function isUser(obj: any): obj is User {
  return obj && 
         typeof obj.email === 'string' && 
         typeof obj.password === 'string' &&
         typeof obj.role === 'string';
}

