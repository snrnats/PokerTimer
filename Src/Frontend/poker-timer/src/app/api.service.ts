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
import { ApiClient } from "./api/api-client";

const baseUrl = Config.backendUrl + "api/";
const tournamentsEndpoint = baseUrl + "tournaments/";
const setupsEndpoint = baseUrl + "setups/";
const pauseEndpoint = "pause/";
const resumeEndpoint = "resume/";
@Injectable()
export class ApiService {
  constructor(private http: ApiClient) {}

  async getTournaments(): Promise<Tournament[]> {
    return await this.http.get<Tournament[]>(tournamentsEndpoint);
  }

  async getTournament(id: number): Promise<Tournament> {
    return await this.http.get<Tournament>(tournamentsEndpoint + `${id}`);
  }

  async createTournament(tournament: Tournament): Promise<Tournament> {
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
