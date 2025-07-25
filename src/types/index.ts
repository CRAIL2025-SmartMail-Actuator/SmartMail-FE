export interface User {
  id: string;
  email: string;
  name: string;
  domain?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  customPrompt?: string;
  tone: 'professional' | 'friendly' | 'formal' | 'casual';
  template: string;
  color: string;
}
export interface Documents {
  documents: CompanyDocument[]
}
export interface CompanyDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  size: number;
  uploadDate: Date;
  content: string;
  categories: string[];
}

export interface Email {
  id: number;
  from: string;
  from_name: string | null;
  to: string;
  subject: string;
  body: string;
  html_body: string | null;
  timestamp: string; // ISO 8601 format
  thread_id: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  labels: string[];
  priority: 'low' | 'normal' | 'high';
  category: string | null;
  ai_analysis: any | null; // replace `any` with a specific type if known
  replied?: boolean; // Indicates if the email has been replied to
}

export interface MailboxConfig {
  id: number;
  email: string;
  appPassword: string;
  autoReplyEmails: string[];
  confidenceThreshold: number;
  enabled: boolean;
  monitoring_status?: boolean;
  auto_reply_enabled?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'sent' | 'failed' | 'pending' | 'approved' | 'rejected';
  email: string;
  subject: string;
  confidence: number;
  action: string;
}
export interface SentEmail {
  id: number;
  to: string[];
  subject: string;
  content: string;
  html_content?: string;
  sent_at: string;
  status: string;
  delivery_status: string;
}