export interface Question {
  id: number;
  id_user: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at?: Date;
}