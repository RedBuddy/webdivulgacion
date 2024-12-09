export interface Article {
  id: number;
  id_author: number;
  title: string;
  doi: string;
  abstract?: string;
  publication_date: Date;
  link?: string;
  pdf?: {
    type: string;
    data: number[];
  };
  pdf_url?: string | null;
  preview_img?: {
    type: string;
    data: number[];
  };
  preview_img_url?: string | null;
  status?: 'published' | 'archived';
}