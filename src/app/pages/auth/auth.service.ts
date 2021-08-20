import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserResponse } from '@app/shared/models/user.interface';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { environment } from '@env/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router'
import { UtilsService } from '@app/shared/services/util.service';
import * as crypto from 'crypto-js';
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user = new BehaviorSubject<UserResponse | null>(null);

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private router: Router, private utilsSvc: UtilsService) {
    this.checkToken();
  }

  get user$(): Observable<UserResponse | null> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse | null {
    return this.user.getValue();
  }

  logIn(authData: User): Observable<UserResponse | void> {
    return this.http.post<UserResponse>(`${environment.URL_API}/auth`, authData).pipe(
      map((user: UserResponse) => {
        this.saveLocalStorage(user);
        this.user.next(user);
        return user;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  logout(): void {
    this.utilsSvc.openSidebar(false);
    localStorage.removeItem("user");
    this.user.next(null);
    this.router.navigate(['']);
  }

  private checkToken(): void {
    try {
      const bytes = crypto.AES.decrypt(String(localStorage.getItem('user')), environment.SECRET_KEY);
      const user = JSON.parse(bytes.toString(crypto.enc.Utf8));
      // const user = JSON.parse(String(localStorage.getItem("user"))) || null;
      if (user) {
        const isExpired = helper.isTokenExpired(user.token);
        if (isExpired) {
          this.logout();
        } else {
          this.user.next(user);
        }
      }
    } catch (error) {
      this.logout();
    }

  }

  private saveLocalStorage(user: UserResponse): void {
    const { message, ...rest } = user;
    var encrypt = crypto.AES.encrypt(JSON.stringify(rest), environment.SECRET_KEY).toString();
    localStorage.setItem("user", encrypt);
  }

  private handleError(err: any): Observable<never> {
    let errorMessage = "Ocurrio un error";

    if (err) {
      errorMessage = `Error: ${typeof err.error.message == 'undefined' ? err.message : err.error.message}`;
      this._snackBar.open(errorMessage, '', {
        duration: 6000
      });
    }
    return throwError(errorMessage);
  }
}
