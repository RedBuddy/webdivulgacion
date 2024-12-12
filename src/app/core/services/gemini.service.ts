import { Injectable } from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  generationConfig = {
    temperature: 0.9,
    top_p: 1,
    top_k: 32,
    maxOutputTokens: 100, // limit output
  };

  readonly #API_KEY = 'AIzaSyBNlA44p1gAXkLV15R4Ys0FNWs5iGgI96E';
  readonly #genAI = new GoogleGenerativeAI(this.#API_KEY);
  readonly #model = this.#genAI.getGenerativeModel({
    model: 'gemini-pro',
    ...this.generationConfig,
  });

  async verifyQuestion(title: string, body: string): Promise<boolean> {
    let prompt = `La pregunta o discusión con titulo ${title} y cuerpo ${body} es adecuada para una plataforma de divulgación científica? devuelve true o false`;
    try {
      const { response } = await this.#model.generateContent(prompt);
      if (response.text().includes('true')) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async verifyAnswer(body: string): Promise<boolean> {
    let prompt = `La respuesta con cuerpo ${body} es adecuada contiene malas palabras, incitación al odio, o es inadecuada? devuelve true o false`;
    try {
      const { response } = await this.#model.generateContent(prompt);
      if (response.text().includes('true')) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Algo salió mal, intenta de nuevo.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error.message || 'Error del servidor';
    }
    console.error('An error occurred:', errorMessage);
    return throwError({ status: error.status, message: errorMessage });
  }
}
