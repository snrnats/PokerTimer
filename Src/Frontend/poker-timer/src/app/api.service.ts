import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Tournament } from '@app/models/tournament.model';
import { catchError, retry, map } from 'rxjs/operators';

import { JsonRevivers } from '@app/shared/json-revivers';
import { Observable, throwError, ObservableInput } from 'rxjs';
import { Config } from '@app/shared/config';

const baseUrl = Config.backendUrl+ "api/";
const tournamentsEndpoint = baseUrl + "tournaments";
const pauseEndpoint = "pause";
const resumeEndpoint = "resume";
@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  getTournaments() {
    return this.http.get(tournamentsEndpoint, { responseType: 'text' }).pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  getTournament(id: number): Observable<Tournament> {
    return this.http.get(tournamentsEndpoint + `/${id}`, { responseType: 'text' }).pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  pauseTournament(id:number): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `/${id}`, "");
  }

  resumeTournament(id:number): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `/${id}`, "");
  }

}
