import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PublicationsComponent } from './features/publications/publications.component';
import { PublicationsCreatedComponent } from './features/publications-created/publications-created.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { RegisterComponent } from './features/user/register/register.component';
import { LoginComponent } from './features/user/login/login.component';
import { DashboardComponent } from './features/dashboards/dashboard.component';
import { ModerationComponent } from './features/moderation/moderation.component';
import { PublicationsCreateFormComponent } from './features/publications-create-form/publications-create-form.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { PublicationShowComponent } from './features/publication-show/publication-show.component';
import { AuthGuard } from './core/guards/auth.guard';
import { SchoolComponent } from './features/school/school.component';
import { BlogComponent } from './features/blogs/blog/blog.component';
import { ArticleShowComponent } from './features/blogs/article-show/article-show.component';
import { ArticleCreateComponent } from './features/blogs/article-create.component';
import { ArticleCreatedComponent } from './features/blogs/article-created/article-created.component';
import { ArticleUpdateComponent } from './features/blogs/article-update.component';
import { ForgotPasswordComponent } from './features/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/user/reset-password/reset-password.component';
import { MessagerieComponent } from './features/messagerie/messagerie.component';
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
  { path: 'ecoles', component: SchoolComponent },
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
