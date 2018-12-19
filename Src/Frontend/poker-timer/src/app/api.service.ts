import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Tournament } from "@app/models/tournament.model";
import { catchError, retry, map, retryWhen } from "rxjs/operators";

import { JsonRevivers } from "@app/shared/json-revivers";
import { Observable, throwError, ObservableInput } from "rxjs";
import { Config } from "@app/shared/config";
import { TournamentSetup } from "@app/models/tournament-setup.model";
import { SetupOwnerFilter } from "@app/api/setup-owner-filter";
import { ApiError } from "@app/api/errors/api-error";
import { IErrorResponse } from "@app/api/error-response";
import { HttpPromiseClient } from "./api/http-promise-client";
import { FuncEx2 } from "./shared/func/func-ex2";

const baseUrl = Config.backendUrl + "api/";
const tournamentsEndpoint = baseUrl + "tournaments/";
const setupsEndpoint = baseUrl + "setups/";
const pauseEndpoint = "pause/";
const resumeEndpoint = "resume/";
@Injectable()
export class ApiService {
  constructor(private http: HttpPromiseClient) {}

  async getTournaments(): Promise<Tournament[]> {
    return await this.http.get<Tournament[]>(tournamentsEndpoint);
  }

  async getTournament(id: number): Promise<Tournament> {
    return await this.http.get<Tournament>(tournamentsEndpoint + `${id}`, { interceptorConfig: { authorize: true } });
  }

  async createTournament(tournament: Tournament): Promise<Tournament> {
    return this.http.post<Tournament>(tournamentsEndpoint, tournament, { interceptorConfig: { authorize: true } });
  }

  updateTournament(tournament: Tournament): Promise<void> {
    return this.http.put(tournamentsEndpoint + `${tournament.id}`, tournament, { interceptorConfig: { authorize: true } });
  }

  getSetups(owner: string): Promise<TournamentSetup[]> {
    return this.http.get(setupsEndpoint, { query: { owner: owner }, interceptorConfig: { authorize: true } });
  }

  createSetup(setup: TournamentSetup): Promise<TournamentSetup> {
    return this.http.post(setupsEndpoint, setup);
  }

  updateSetup(setup: TournamentSetup): Promise<void> {
    return this.http.put(setupsEndpoint + `${setup.id}`, setup);
  }

  deleteSetup(id: number): Promise<void> {
    return this.http.delete(setupsEndpoint + `${id}`);
  }

  getSetup(id: number): Promise<TournamentSetup> {
    return this.http.get(setupsEndpoint + `${id}`);
  }

  pauseTournament(id: number): Promise<Tournament> {
    return this.http.put<Tournament>(tournamentsEndpoint + `${id}/pause`, "");
  }

  resumeTournament(id: number): Promise<Tournament> {
    return this.http.put<Tournament>(tournamentsEndpoint + `${id}/resume`, "");
  }
}
