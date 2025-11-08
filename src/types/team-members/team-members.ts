export interface MemberFormData {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image: string;
  email: string;
  password: string;
  mobile: string;
}

export type MemberRole = "admin" | "moderator" | "user";
export type MemberAccess = "owner" | "member";
export type MemberStatus = "active" | "inactive" | "suspended";

export interface Member {
  _id: string;
  name: string;
  role: MemberRole;
  bio: string;
  access: MemberAccess;
  expertise: string[];
  image: string;
  email: string;
  password: string;
  mobile: string;
  status: MemberStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MembersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MembersResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  meta: MembersMeta;
  data: Member[];
}

export interface DeleteMemberResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
}
