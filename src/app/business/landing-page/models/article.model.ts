export interface IArticle {
  id_author: number;
  title: string;
  doi: string;
  abstract?: string;
  publication_date?: Date;
  link?: string;
  pdf?: Blob;
  preview_img?: Blob;
  status?: 'published' | 'archived';
}

// Ejemplo de uso
const exampleArticle: IArticle = {
  id_author: 1,
  title: 'Example Title',
  doi: '10.1234/example.doi',
  abstract: 'This is an example abstract.',
  publication_date: new Date(),
  link: 'http://example.com',
  pdf: new Blob(),
  preview_img: new Blob(),
  status: 'published'
};