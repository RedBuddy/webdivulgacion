export interface Article {
  id: number;
  id_author: number;
  title: string;
  doi: string;
  abstract?: string;
  publication_date: Date;
  link?: string;
  pdf?: Blob;
  preview_img?: {
    type: string;
    data: number[];
  };
  preview_img_url?: string | null;
  status?: 'published' | 'archived';
}