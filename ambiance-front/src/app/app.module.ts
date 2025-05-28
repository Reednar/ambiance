import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PublicationsComponent } from './pages/publications/publications.component';
import { PublicationsCreatedComponent } from './pages/publications-created/publications-created.component';
import { LoginComponent } from './pages/user/login/login.component';
import { DashboardComponent } from './pages/dashboards/dashboard.component';
import { ModerationComponent } from './pages/moderation/moderation.component';
import { FooterComponent } from './footer/footer.component';
import { MenuModule } from 'primeng/menu';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PublicationsCreateFormComponent } from './pages/publications-create-form/publications-create-form.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { PublicationShowComponent } from './pages/publication-show/publication-show.component';
import { EcoleComponent } from './pages/ecole/ecole.component';
import { BlogComponent } from './pages/blogs/blog/blog.component';
import { ArticleCreateComponent } from './pages/blogs/article-create.component';
import { ArticleShowComponent } from './pages/blogs/article-show/article-show.component';
import { ArticleCreatedComponent } from './pages/blogs/article-created/article-created.component';
import { ArticleFormComponent } from './pages/blogs/article-form/article-form.component';
import { ArticleUpdateComponent } from './pages/blogs/article-update.component';
import { ForgotPasswordComponent } from './pages/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/user/reset-password/reset-password.component';
import { MessagerieComponent } from './pages/messagerie/messagerie.component';

// Import et enregistrement de la locale française
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CalendarComponent,
    RegisterComponent,
    ModerationComponent,
    DashboardComponent,
    LoginComponent,
    PublicationsCreatedComponent,
    PublicationsComponent,
    PublicationsCreateFormComponent,
    ProfileComponent,
    PublicationShowComponent,
    EcoleComponent,
    BlogComponent,
    ArticleCreateComponent,
    ArticleShowComponent,
    ArticleCreatedComponent,
    ArticleFormComponent,
    ArticleUpdateComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent, 
    MessagerieComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    TableModule,
    CardModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    TagModule,
    ToastModule,
    StepsModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    FullCalendarModule,
    HttpClientModule,
    MenuModule,
    OverlayModule,
    OverlayPanelModule,
    MessageModule,
    MessagesModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
