import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PublicationsComponent } from './pages/publications/publications.component';
import { PublicationsCreatedComponent } from './pages/publications-created/publications-created.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { LoginComponent } from './pages/user/login/login.component';
import { DashboardComponent } from './pages/dashboards/dashboard.component';
import { ModerationComponent } from './pages/moderation/moderation.component';
import { PublicationsCreateFormComponent } from './pages/publications-create-form/publications-create-form.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { PublicationShowComponent } from './pages/publication-show/publication-show.component';
import { AuthGuard } from './service/auth.guard';
import { EcoleComponent } from './pages/ecole/ecole.component';
import { BlogComponent } from './pages/blogs/blog/blog.component';
import { ArticleShowComponent } from './pages/blogs/article-show/article-show.component';
import { ArticleCreateComponent } from './pages/blogs/article-create.component';
import { ArticleCreatedComponent } from './pages/blogs/article-created/article-created.component';
import { ArticleUpdateComponent } from './pages/blogs/article-update.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/user/reset-password/reset-password.component';
import { MessagerieComponent } from './pages/messagerie/messagerie.component';
// Déclaration des routes avec les bons droits
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'publicationsCreated', component: PublicationsCreatedComponent, canActivate: [AuthGuard] },
  { path: 'publicationsCreateForm', component: PublicationsCreateFormComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboards', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'moderation', component: ModerationComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'publication-show/:id', component: PublicationShowComponent },
  { path: 'ecoles', component: EcoleComponent },
  { path: 'articles', component: BlogComponent },
  { path: 'article-show', component: BlogComponent },
  { path: 'article-create', component: ArticleCreateComponent, canActivate: [AuthGuard]  },
  { path: 'article-created', component: ArticleCreatedComponent, canActivate: [AuthGuard]  },
  { path: 'article/:id', component: ArticleShowComponent },
  { path: 'article-update/:id', component: ArticleUpdateComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'messagerie', component: MessagerieComponent,  canActivate: [AuthGuard]},//
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
