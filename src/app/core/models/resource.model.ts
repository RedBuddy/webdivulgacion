export interface Resource {
  id: number;
  id_author: number;
  resource_category: 'guias' | 'talleres' | 'convocatorias';
  title: string;
  description?: string;
  link?: string;
  pdf?: {
    type: string;
    data: number[];
  };
  pdf_url?: string | null;
  publication_date: Date;
}