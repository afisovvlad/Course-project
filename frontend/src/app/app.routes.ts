import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {MainComponent} from './views/main/main.component';
import {BlogComponent} from './views/blog/blog.component';
import {ArticleComponent} from './views/article/article.component';
import {authForwardGuard} from './core/services/auth-forward.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: MainComponent},
      {path: 'blog', component: BlogComponent},
      {path: 'blog/:url', component: ArticleComponent},
      {path: '', loadChildren: () => import('./views/auth/auth.routes').then(m => m.AuthRoutes), canActivate: [authForwardGuard]},
      {path: '**', redirectTo: 'home'},
    ]
  },
];
