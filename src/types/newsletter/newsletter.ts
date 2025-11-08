export interface NewsletterData {
  subject: string;
  message: string;
}

export interface NewsletterResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data?: unknown;
}
