import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../core/services/auth.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {LoginResponseType} from '../../../../types/login-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {NgStyle} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm!: FormGroup;

  private loginSubscription!: Subscription;

  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,) {
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([A-ZА-Я][a-zа-я]*(\s|$))*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      this.loginSubscription = this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: ((data: DefaultResponseType | LoginResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open((data as DefaultResponseType).message)
              return;
            }

            const loginResponse = data as LoginResponseType;

            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              this._snackBar.open('Ошибка регистрации')
              return;
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/home']);
          }),

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
