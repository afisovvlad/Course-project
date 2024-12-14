import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {LoginResponseType} from '../../../../types/login-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {NgStyle} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  private loginSubscription!: Subscription;

  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loginSubscription = this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: ((data: DefaultResponseType | LoginResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open((data as DefaultResponseType).message)
              return;
            }

            const loginResponse = data as LoginResponseType;

            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              this._snackBar.open('Ошибка авторизации')
              return;
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/home']).then();
          }),

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
