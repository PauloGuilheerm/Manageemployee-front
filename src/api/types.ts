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
  fullName: string;
  email: string;
  docNumber: string;
  role: Role;
  phones: Phone[];
  birthDate: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
