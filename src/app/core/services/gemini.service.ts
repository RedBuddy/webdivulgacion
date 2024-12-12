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
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
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

  async verifyQuestion(title: string, body: string): Promise<string> {
    console.log(title, body);
    let prompt = `La pregunta con titulo ${title} y cuerpo ${body} es adecuada para una plataforma de divulgación científica? devuelve true o false`;
    try {
      const { response } = await this.#model.generateContent(prompt);
      return response.text();
    } catch (error) {
      console.error('El error es:' + error);
      return 'An error has occurred. Please try again.';
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
