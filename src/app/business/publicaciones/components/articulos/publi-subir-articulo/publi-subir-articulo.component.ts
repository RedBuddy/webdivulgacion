import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticleService } from '../../../../../core/services/article.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-publi-subir-articulo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publi-subir-articulo.component.html',
  styleUrls: ['./publi-subir-articulo.component.scss']
})
export class PubliSubirArticuloComponent {

  articleForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private fb: FormBuilder, private articleService: ArticleService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      doi: ['', Validators.required],
      abstract: [''],
      publication_date: ['', Validators.required],
      link: [''],
      pdf: [null],
      preview_img: [null]
    });
  }



  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.articleForm.patchValue({ [controlName]: file });
    }
  }

  submitArticle(): void {
    if (this.articleForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.articleForm.controls).forEach(key => {
      formData.append(key, this.articleForm.get(key)?.value);
    });

    this.articleService.uploadArticle(formData).subscribe({
      next: () => {
        this.successMessage = 'Artículo subido exitosamente';
        this.errorMessage = null;
        this.articleForm.reset();
      },
      error: (err) => {
        console.error('Error uploading article', err);
        this.errorMessage = 'Error al subir el artículo';
        this.successMessage = null;
      }
    });
  }

}
