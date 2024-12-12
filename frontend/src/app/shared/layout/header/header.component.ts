import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserInfoType} from '../../../../types/user-info.type';
import {DefaultResponseType} from '../../../../types/default-response.type';

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
export class HeaderComponent implements OnInit {
  currentFragment: string | null = null;
  userInfo: UserInfoType | null = null;
  isLoggedIn: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router,
              private authService: AuthService,) {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      if (this.isLoggedIn) {
        this.authService.getUserInfo()
          .subscribe(userInfo => {
            if ((userInfo as DefaultResponseType).error !== undefined) {
              throw new Error((userInfo as DefaultResponseType).message);
            }
            this.userInfo = userInfo as UserInfoType;
          });
      }
    });

    this.router.events.pipe(
    ).subscribe(() => {
      this.currentFragment = this.router.routerState.snapshot.root.fragment;
    });
  }

  isFragmentActive(fragment: string): boolean {
    return this.currentFragment === fragment;
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },

        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/home']);
  }
}

