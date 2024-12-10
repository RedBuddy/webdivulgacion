export interface Question {
  id: number;
  id_user: number;
  title: string;
  body: string;
  active: boolean;
  created_at: Date;
  updated_at?: Date;
}