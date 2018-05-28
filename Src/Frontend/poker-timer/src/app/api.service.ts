import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Tournament } from "@app/models/tournament.model";
import { catchError, retry, map } from "rxjs/operators";

import { JsonRevivers } from "@app/shared/json-revivers";
import { Observable, throwError, ObservableInput } from "rxjs";
import { Config } from "@app/shared/config";
import { TournamentSetup } from "@app/models/tournament-setup.model";

const baseUrl = Config.backendUrl + "api/";
const tournamentsEndpoint = baseUrl + "tournaments/";
const setupsEndpoint = baseUrl + "setups/";
const pauseEndpoint = "pause/";
const resumeEndpoint = "resume/";
@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(
      "Something bad happened; please try again later.");
  }

  getTournaments() {
    return this.http.get(tournamentsEndpoint, { responseType: "text" }).
      pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  getTournament(id: number): Observable<Tournament> {
    return this.http.get(tournamentsEndpoint + `${id}`, { responseType: "text" }).
      pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  createTournament(tournament: Tournament): Observable<Tournament> {
    return this.http.post(tournamentsEndpoint, tournament, { responseType: "text" }).
      pipe(catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  updateTournament(tournament: Tournament): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `${tournament.id}`, tournament).pipe(catchError(this.handleError));
  }

  getSetups(): Observable<TournamentSetup[]> {
    return this.http.get(setupsEndpoint, { responseType: "text" }).
      pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  createSetup(setup: TournamentSetup): Observable<TournamentSetup> {
    return this.http.post(setupsEndpoint, setup, { responseType: "text" }).
      pipe(catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  updateSetup(setup: TournamentSetup): Observable<Object> {
    return this.http.put(setupsEndpoint + `${setup.id}`, setup).pipe(catchError(this.handleError));
  }

  getSetup(id: number): Observable<TournamentSetup> {
    return this.http.get(setupsEndpoint + `${id}`, { responseType: "text" }).
      pipe(retry(3), catchError(this.handleError), map(res => JSON.parse(res, JsonRevivers.date)));
  }

  pauseTournament(id: number): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `${id}`, "");
  }

  resumeTournament(id: number): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `${id}`, "");
  }

}
