import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserInfoType} from '../../../../types/user-info.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentFragment: string | null = null;
  userInfo: UserInfoType | null = null;
  isLoggedIn: boolean = false;
  private subs: Subscription = new Subscription();
  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router,
              private authService: AuthService,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.subs.add(this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      this.getUserInfo();
    }));

    this.getUserInfo()

    this.subs.add(this.router.events.subscribe(() => {
      this.currentFragment = this.router.routerState.snapshot.root.fragment;
    }));
  }

  getUserInfo() {
    if (this.isLoggedIn) {
      this.subs.add(this.authService.getUserInfo()
        .subscribe(userInfo => {
          if ((userInfo as DefaultResponseType).error !== undefined) {
            throw new Error((userInfo as DefaultResponseType).message);
          }
          this.userInfo = userInfo as UserInfoType;
        }));
    }
  }

  isFragmentActive(fragment: string): boolean {
    return this.currentFragment === fragment;
  }

  logout() {
    this.subs.add(this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },

        error: () => {
          this.doLogout();
        }
      }));
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/home']).then();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

