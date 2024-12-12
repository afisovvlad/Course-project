import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {UserInfoType} from '../../../types/user-info.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';

  public isLoggedIn$: Subject<boolean> = new Subject<boolean>();
  private isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem(this.accessTokenKey);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedIn = true;
    this.isLoggedIn$.next(true);
  }

  removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn = false;
    this.isLoggedIn$.next(false);
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  set userId(id: null | string) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', {
      headers: {'x-auth': JSON.stringify(localStorage.getItem(this.accessTokenKey))}
    });
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', {
      email: email,
      password: password,
      rememberMe: rememberMe,
    });
  }

  signup(name: string, email: string, password: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {
      name: name,
      email: email,
      password: password,
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken ) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      });
    }

    throw throwError(() => 'Can not find token');
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();

    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      });
    }

    throw throwError(() => 'Can not use token');
  }
}
