import { Routes } from '@angular/router';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {PolicyComponent} from './policy/policy.component';

export const AuthRoutes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'policy',
    component: PolicyComponent
  }
];
