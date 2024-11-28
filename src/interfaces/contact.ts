export interface ContactRegisterData {
  title: string;
  description: string;
  user_id: string;
  contact_type_id: number;
}

export interface Contact extends ContactRegisterData {
  id: string;
  status: "active" | "inactive";
  answer: string | null;
  created_at: string;
  updated_at: string;
  contact_type: ContactType;
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export interface ContactResponse {
  contact: Contact;
}

export interface ContactsResponse {
  contacts: Contact[];
}

export interface ContactType {
  id: number;
  description: string;
}

export interface ContactTypesResponse {
  contactTypes: ContactType[];
}

export interface ContactReplyData {
  answer: string;
}
