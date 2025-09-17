export interface Token {
  sub: string;
  role?: string;
  usuarioId?: number;
  clubId?: number;
  asociacionId?: number;
  iat?: number;
  rv?: number; // refresh version si lo usas
  exp?: number;
}


