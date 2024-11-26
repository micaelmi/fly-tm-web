export interface ContactRegisterData {
  title: string;
  description: string;
  user_id: string;
  contact_type_id: number;
}

export interface Contact extends ContactRegisterData {
  id: string;
  status: "active" | "inactive";
  answer: string;
  created_at: string;
  updated_at: string;
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
