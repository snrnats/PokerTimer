import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Tournament } from "@app/models/tournament.model";
import { catchError, retry, map, retryWhen } from "rxjs/operators";

import { JsonRevivers } from "@app/shared/json-revivers";
import { Observable, throwError, ObservableInput } from "rxjs";
import { Config } from "@app/shared/config";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { SetupOwnerFilter } from "@app/api/setup-owner-filter";
import { ApiError } from "@app/api/errors/api-error";
import { IErrorResponse } from "@app/api/error-response";

const baseUrl = Config.backendUrl + "api/";
const tournamentsEndpoint = baseUrl + "tournaments/";
const setupsEndpoint = baseUrl + "setups/";
const pauseEndpoint = "pause/";
const resumeEndpoint = "resume/";
@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  private handleError(error: any): never {
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error("A network error occurred:", error.error.message);
        throw error;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        const errorResponse = <IErrorResponse>JSON.parse(error.message);
        throw new ApiError(error.status, errorResponse.code, errorResponse.message);
      }
    } else {
      // An error in interceptor occured
      throw error;
    }
  }

  getTournaments() {
    return this.http.get(tournamentsEndpoint, { responseType: "text" }).pipe(
      catchError(this.handleError),
      map(res => {
        return JSON.parse(res, JsonRevivers.date);
      })
    );
  }

  getTournament(id: number): Observable<Tournament> {
    return this.http.get(tournamentsEndpoint + `${id}`, { responseType: "text" }).pipe(
      catchError(this.handleError),
      map(res => JSON.parse(res, JsonRevivers.date))
    );
  }

  createTournament(tournament: Tournament): Observable<Tournament> {
    return this.http.post(tournamentsEndpoint, tournament, { responseType: "text" }).pipe(
      catchError(this.handleError),
      map(res => JSON.parse(res, JsonRevivers.date))
    );
  }

  updateTournament(tournament: Tournament): Observable<Object> {
    return this.http.put(tournamentsEndpoint + `${tournament.id}`, tournament).pipe(catchError(this.handleError));
  }

  getSetups(owner: string): Observable<TournamentSetup[]> {
    return this.http.get(setupsEndpoint, { responseType: "text", params: { owner: owner } }).pipe(
      catchError(this.handleError),
      map(res => JSON.parse(res, JsonRevivers.date))
    );
  }

  createSetup(setup: TournamentSetup): Observable<TournamentSetup> {
    return this.http.post(setupsEndpoint, setup, { responseType: "text" }).pipe(
      catchError(this.handleError),
      map(res => JSON.parse(res, JsonRevivers.date))
    );
  }

  updateSetup(setup: TournamentSetup): Observable<Object> {
    return this.http.put(setupsEndpoint + `${setup.id}`, setup).pipe(catchError(this.handleError));
  }

  deleteSetup(id: number): Observable<Object> {
    return this.http.delete(setupsEndpoint + `${id}`).pipe(catchError(this.handleError));
  }

  getSetup(id: number): Observable<TournamentSetup> {
    return this.http.get(setupsEndpoint + `${id}`, { responseType: "text" }).pipe(
      catchError(this.handleError),
      map(res => JSON.parse(res, JsonRevivers.date))
    );
  }

  pauseTournament(id: number): Observable<Tournament> {
    return this.http.put<Tournament>(tournamentsEndpoint + `${id}/pause`, "");
  }

  resumeTournament(id: number): Observable<Tournament> {
    return this.http.put<Tournament>(tournamentsEndpoint + `${id}/resume`, "");
  }
}
