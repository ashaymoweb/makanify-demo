export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

export interface TokenInfo {
  token: string;
  expires: string;
}

export interface AuthTokens {
  access: TokenInfo;
  refresh: TokenInfo;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: {
    id?: { name?: string; id?: string };
    role?: string[];
  };
}

export interface LoginData {
  user: AuthUser;
  tokens: AuthTokens;
  permissions?: string[];
}

export interface ContactPhone {
  countryCode: number;
  number: number;
  isPrimary?: boolean;
}

export interface Contact {
  _id: string;
  id?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: ContactPhone[];
  gender?: ContactGender;
  companyName?: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactGender = "Male" | "Female" | "Other";

export interface ContactListData {
  results: Contact[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface CreateContactPayload {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: ContactPhone[];
  pinCode: number;
  gender?: ContactGender;
  addressLine1?: string;
  addressLine2?: string;
  companyName?: string;
  position?: string;
  workEmail?: string;
  workPhoneNumber?: string;
}
