import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../../core/services/question.service';
import { Question } from '../../../../core/models/question.model';
import { AnswerService } from '../../../../core/services/answer.service';
import { Answer } from '../../../../core/models/answer.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Author } from '../../../../core/models/author.model';

@Component({
  selector: 'app-pregunta-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pregunta-detail.component.html',
  styleUrl: './pregunta-detail.component.scss'
})

export class PreguntaDetailComponent implements OnInit {
  preguntaId: string | null = null;
  question: Question | null = null;
  respuestas: Answer[] = [];
  respuestaForm: FormGroup;
  errorMessage: string | null = null;
  author: Author | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private authService: AuthService
  ) {
    this.respuestaForm = this.fb.group({
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.preguntaId = this.route.snapshot.paramMap.get('id');
    if (this.preguntaId) {
      this.loadQuestionDetails(parseInt(this.preguntaId, 10));
      this.loadAnswers(parseInt(this.preguntaId, 10));
    }
  }

  loadQuestionDetails(id: number): void {
    this.questionService.getQuestionById(id).subscribe({
      next: (question: Question) => {
        this.question = question;
        this.loadAuthorForQuestion(question.id);
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading question details', err);
        this.errorMessage = 'Error al cargar los detalles de la pregunta.';
      }
    });
  }

  loadAuthorForQuestion(questionId: number): void {
    this.questionService.getAuthorByQuestionId(questionId).subscribe({
      next: (author: Author) => {
        this.author = author;
      },
      error: (err) => {
        console.error('Error loading author for question', err);
      }
    });
  }

  loadAnswers(questionId: number): void {
    this.answerService.getAnswersByQuestionId(questionId).subscribe({
      next: (answers: Answer[]) => {
        this.respuestas = answers;
      },
      error: (err) => {
        console.error('Error loading answers', err);
        this.errorMessage = 'Error al cargar las respuestas.';
      }
    });
  }

  onSubmit(): void {
    if (this.respuestaForm.valid) {
      const body = this.respuestaForm.value.body;
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        this.errorMessage = 'Error al obtener el ID del usuario.';
        return;
      }
      this.answerService.createAnswer(this.question!.id, userId, body).subscribe({
        next: (response) => {
          this.respuestas.push(response);
          this.respuestaForm.reset();
          if (this.preguntaId) {
            this.loadAnswers(parseInt(this.preguntaId, 10));
          }
        },
        error: (err) => {
          console.error('Error creating answer', err);
          this.errorMessage = 'Error al enviar la respuesta.';
        }
      });
    }
  }
}
