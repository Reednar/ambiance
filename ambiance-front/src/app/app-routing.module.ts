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
  { path: 'blogs', component: BlogComponent },
  { path: 'article-show', component: BlogComponent },
  { path: 'article-create', component: BlogComponent },
  { path: 'article-created', component: BlogComponent },
  { path: 'article/:id', component: ArticleShowComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
