
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string;
}

export interface Answer {
  id: number;
  body: string;
  id_question: number;
  user: User;
  created_at: Date;
  updated_at?: Date;
}