export interface Article {
  id: number;
  id_author: number;
  title: string;
  doi: string;
  abstract?: string;
  publication_date: Date;
  link?: string;
  pdf?: Blob;
  preview_img?: Blob;
  status?: 'published' | 'archived';
}