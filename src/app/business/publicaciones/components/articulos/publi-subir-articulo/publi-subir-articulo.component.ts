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
export class PubliSubirArticuloComponent implements OnInit {

  articleForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedPdf: File | null = null;
  selectedPreviewImg: File | null = null;

  constructor(private fb: FormBuilder, private articleService: ArticleService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      doi: ['', Validators.required],
      abstract: [''],
      publication_date: ['', Validators.required],
      link: ['']
    });
  }

  ngOnInit(): void { }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (fileType === 'pdf') {
        this.selectedPdf = file;
      } else if (fileType === 'preview_img') {
        this.selectedPreviewImg = file;
      }
    }
  }

  submitArticle(): void {
    if (this.articleForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.articleForm.controls).forEach(key => {
      const controlValue = this.articleForm.get(key)?.value;
      formData.append(key, controlValue);
    });

    if (this.selectedPdf) {
      formData.append('pdf', this.selectedPdf, this.selectedPdf.name);
    }

    if (this.selectedPreviewImg) {
      formData.append('preview_img', this.selectedPreviewImg, this.selectedPreviewImg.name);
    }

    this.articleService.uploadArticle(formData).subscribe({
      next: () => {
        this.successMessage = 'Artículo subido exitosamente';
        this.errorMessage = null;
        this.articleForm.reset();
        this.selectedPdf = null;
        this.selectedPreviewImg = null;
      },
      error: (err) => {
        console.error('Error uploading article', err);
        this.errorMessage = 'Error al subir el artículo';
        this.successMessage = null;
      }
    });
  }
}
