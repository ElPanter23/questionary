import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface DemoSession {
  sSessionId: string;
  sCreatedAt: string;
  sLastActivity: string;
  oCharacters: any[];
  oQuestions: any[];
  oAnswers: any[];
}

export interface DemoCharacter {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface DemoQuestion {
  id: number;
  text: string;
  category?: string;
  difficulty?: number;
}

export interface DemoGameQuestion {
  character: DemoCharacter;
  question: DemoQuestion;
}

export interface DemoCharacterStatus {
  id: number;
  name: string;
  description?: string;
  answered_count: number;
  total_questions: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private baseUrl = '/api/demo';
  private currentSessionSubject = new BehaviorSubject<string | null>(null);
  public currentSession$ = this.currentSessionSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if there's a session in localStorage on service initialization
    const savedSession = localStorage.getItem('demoSessionId');
    if (savedSession) {
      this.currentSessionSubject.next(savedSession);
    }
  }

  startDemo(): Observable<string> {
    return this.http.post<{ sessionId: string }>(`${this.baseUrl}/start`, {}).pipe(
      map(response => response.sessionId),
      tap(sSessionId => {
        this.currentSessionSubject.next(sSessionId);
        localStorage.setItem('demoSessionId', sSessionId);
      })
    );
  }

  validateDemoSession(sSessionId: string): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.baseUrl}/validate/${sSessionId}`).pipe(
      map(response => response.valid),
      tap(bIsValid => {
        if (bIsValid) {
          this.currentSessionSubject.next(sSessionId);
          localStorage.setItem('demoSessionId', sSessionId);
        }
      })
    );
  }

  getDemoCharacters(): Observable<DemoCharacter[]> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.get<DemoCharacter[]>(`${this.baseUrl}/${sSessionId}/characters`);
  }

  getDemoQuestions(): Observable<DemoQuestion[]> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.get<DemoQuestion[]>(`${this.baseUrl}/${sSessionId}/questions`);
  }

  getRandomDemoQuestion(iCharacterId: number, iSeason?: number): Observable<DemoGameQuestion> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    const url = iSeason ? 
      `${this.baseUrl}/${sSessionId}/question/${iCharacterId}?season=${iSeason}` : 
      `${this.baseUrl}/${sSessionId}/question/${iCharacterId}`;
    return this.http.get<DemoGameQuestion>(url);
  }

  markDemoQuestionAnswered(iCharacterId: number, iQuestionId: number, sAnswerText: string): Observable<any> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.post(`${this.baseUrl}/${sSessionId}/answer`, {
      characterId: iCharacterId,
      questionId: iQuestionId,
      answerText: sAnswerText
    });
  }

  getDemoCharacterStatus(): Observable<DemoCharacterStatus[]> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.get<DemoCharacterStatus[]>(`${this.baseUrl}/${sSessionId}/status`);
  }

  resetDemoCharacter(iCharacterId: number): Observable<any> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.delete(`${this.baseUrl}/${sSessionId}/reset/${iCharacterId}`);
  }

  resetAllDemoCharacters(): Observable<any> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.delete(`${this.baseUrl}/${sSessionId}/reset-all`);
  }

  getDemoCharacterAnswers(iCharacterId: number): Observable<any> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.get(`${this.baseUrl}/${sSessionId}/answers/${iCharacterId}`);
  }

  addDemoCharacter(character: DemoCharacter): Observable<DemoCharacter> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.post<DemoCharacter>(`${this.baseUrl}/${sSessionId}/characters`, character);
  }

  getDemoCharacterStats(iCharacterId: number): Observable<any> {
    const sSessionId = this.currentSessionSubject.value;
    if (!sSessionId) {
      throw new Error('No active demo session');
    }
    return this.http.get(`${this.baseUrl}/${sSessionId}/stats/${iCharacterId}`);
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionSubject.value;
  }

  clearSession(): void {
    this.currentSessionSubject.next(null);
    localStorage.removeItem('demoSessionId');
  }
}
