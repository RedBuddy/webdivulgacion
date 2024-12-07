export interface ResearchProject {
  id: number;
  id_author: number;
  title: string;
  details?: string;
  vacancies?: number;
  preview_img?: {
    type: string;
    data: number[];
  };
  preview_img_url?: string | null;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}