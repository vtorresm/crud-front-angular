import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Game } from '../interfaces/Game';

import { environment } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getGames(): Observable<Game[]> {
    return this.http
      .get<Game[]>(`${this.BASE_URL}/games`)
      .pipe(catchError(this.handleError));
  }

  getGame(id: string): Observable<Game> {
    return this.http
      .get<Game>(`${this.BASE_URL}/games/${id}`)
      .pipe(catchError(this.handleError));
  }

  createGame(game: Game): Observable<Game> {
    return this.http
      .post<Game>(`${this.BASE_URL}/games/create`, game)
      .pipe(catchError(this.handleError));
  }

  deleteGame(id: number): Observable<Game> {
    return this.http
      .delete<Game>(`${this.BASE_URL}/games/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateGame(id: string, game: Game): Observable<Game> {
    return this.http
      .put<Game>(`${this.BASE_URL}/games/${id}`, game)
      .pipe(catchError(this.handleError));
  }
}
