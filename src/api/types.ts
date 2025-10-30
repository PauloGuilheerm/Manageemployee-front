// ATENÇÃO: Arquivo gerado automaticamente por scripts/generate-types.cjs
// Execute npm run gen:types para atualizar.

export type Role = "Director" | "Leader" | "Employee";
export type PhoneType = "Mobile" | "Home" | "Work";

export interface Phone {
  number: string;
  type: PhoneType;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  docNumber: string;
  role: Role;
  phones: Phone[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
