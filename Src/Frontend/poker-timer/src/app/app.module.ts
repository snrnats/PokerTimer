import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatExpansionModule,
  MatTableModule,
  MatSortModule,
  MatIconModule,
  MatMenuModule,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatListModule,
  MatRippleModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatSnackBar,
  MatSnackBarModule
} from "@angular/material";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AppComponent } from "@app/app.component";
import { NavComponent } from "@app/nav/nav.component";
import { LoginComponent } from "@app/login/login.component";
import { RegisterComponent } from "@app/register/register.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { AuthService } from "@app/auth.service";
import { ApiService } from "@app/api.service";
import { TournamentsComponent } from "@app/tournament/tournaments.component";
import { AuthInterceptor } from "@app/auth/auth.interceptor";
import { TournamentComponent } from "@app/tournament/tournament.component";
import { TimeSpanPipe } from "@app/pipes/time-span.pipe";
import { TournamentEditComponent } from "@app/tournament/tournament-edit.component";
import { DateTimeInputComponent } from "@app/custom-controls/datetime-input";
import { DatePipe } from "@angular/common";
import { SetupEditComponent } from "@app/setup/setup-edit.component";
import { SetupsComponent } from "@app/setup/setups.component";
import { SetupComponent } from "@app/setup/setup.component";
import { PageNotFoundComponent } from "@app/page-not-found/page-not-found.component";
import { ConfirmDialogComponent } from "@app/shared/confirm-dialog/confirm-dialog.component";
import { GlobalErrorHandler } from "@app/shared/global-error-handler";
import { ToastService } from "@app/shared/toast.service";
import { HttpErrorsInterceptor } from "./api/http-errors.interceptor";
/*
Add visibility to setups and tournaments: only me (private), not listed (by id), public
Handle server and network errors
*/
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DateTimeInputComponent,
    LoginComponent,
    RegisterComponent,
    TournamentsComponent,
    TournamentComponent,
    TimeSpanPipe,
    TournamentEditComponent,
    SetupEditComponent,
    SetupsComponent,
    SetupComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    ApiService,
    DatePipe,
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
