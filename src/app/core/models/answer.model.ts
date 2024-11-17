
export interface IAnswer {
  id?: number;
  id_question: number;
  body: string;
  id_user: number;
}

// Ejemplo de peticion
const answer1: IAnswer = {
  id_question: 1,
  body: 'This is an example answer',
  id_user: 1
};
