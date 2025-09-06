import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  text: string;
  category?: string;
  difficulty?: number;
  created_at: string;
}

export interface Character {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface GameQuestion {
  character: Character;
  question: Question;
}

export interface CharacterStatus {
  id: number;
  name: string;
  description?: string;
  answered_count: number;
  total_questions: number;
}

export interface QuestionAnswer {
  id: number;
  character_id: number;
  question_id: number;
  answer_text: string;
  answered_at: string;
  question: Question;
}

export interface CharacterAnswers {
  character: Character;
  answers: QuestionAnswer[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Questions
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  getQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/questions/${id}`);
  }

  addQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }

  addQuestions(questions: Partial<Question>[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/questions/bulk`, { questions });
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`);
  }

  // Scraping
  scrapeFrom100Fragen(category: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/questions/scrape/100fragen`, { category });
  }

  scrapeFromCustomUrl(url: string, category: string, difficulty: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/questions/scrape/custom`, { url, category, difficulty });
  }

  getScrapingCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/questions/scrape/categories`);
  }

  // Characters
  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters`);
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/characters/${id}`);
  }

  addCharacter(character: Partial<Character>): Observable<Character> {
    return this.http.post<Character>(`${this.baseUrl}/characters`, character);
  }

  updateCharacter(id: number, character: Partial<Character>): Observable<Character> {
    return this.http.put<Character>(`${this.baseUrl}/characters/${id}`, character);
  }

  deleteCharacter(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/characters/${id}`);
  }

  // Game
  getRandomQuestion(characterId: number): Observable<GameQuestion> {
    return this.http.get<GameQuestion>(`${this.baseUrl}/game/question/${characterId}`);
  }

  markQuestionAnswered(characterId: number, questionId: number, answerText: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/game/answer`, {
      characterId,
      questionId,
      answerText
    });
  }

  getCharacterStatus(): Observable<CharacterStatus[]> {
    return this.http.get<CharacterStatus[]>(`${this.baseUrl}/game/status`);
  }

  resetCharacter(characterId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/game/reset/${characterId}`);
  }

  resetAllCharacters(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/game/reset-all`);
  }

  getCharacterAnswers(characterId: number): Observable<CharacterAnswers> {
    return this.http.get<CharacterAnswers>(`${this.baseUrl}/game/answers/${characterId}`);
  }

  // Admin
  clearDatabase(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/clear-db`);
  }

  preloadExampleData(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/preload-data`, {});
  }

  getDatabaseStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`);
  }
}
