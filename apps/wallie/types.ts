/** Apollo lead shown in chat for enrichment */
export interface ApolloLead {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  companyName?: string;
  email?: string;
  linkedinUrl?: string;
  photo?: string;
}

/** Tool execution results stored per AI message (deterministic; not from AI output). */
export interface WallieToolResults {
  apollo_people?: ApolloLead[];
  web_search?: unknown;
  email_draft?: import("@/lib/wallie/email-draft").WallieEmailDraft;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  // For AI messages - typing animation state
  renderedContent?: string;
  isTyping?: boolean;
  /** People from Apollo search; show cards with Enrich action */
  apolloPeople?: ApolloLead[];
  /** Email compose/reply draft from Wallie agent */
  emailDraft?: import("@/lib/wallie/email-draft").WallieEmailDraft;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
