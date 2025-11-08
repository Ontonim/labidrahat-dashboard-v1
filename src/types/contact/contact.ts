export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactsResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: ContactMessage[];
}
