import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
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
import { CalendarComponent } from './features/calendar/calendar.component';
import { RegisterComponent } from './features/user/register/register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PublicationsComponent } from './features/publications/publications.component';
import { PublicationsCreatedComponent } from './features/publications-created/publications-created.component';
import { LoginComponent } from './features/user/login/login.component';
import { DashboardComponent } from './features/dashboards/dashboard.component';
import { ModerationComponent } from './features/moderation/moderation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PublicationsCreateFormComponent } from './features/publications-create-form/publications-create-form.component';
import { ProfileComponent } from './features/user/profile/profile.component';
import { PublicationShowComponent } from './features/publication-show/publication-show.component';
import { SchoolComponent } from './features/school/school.component';
import { BlogComponent } from './features/blogs/blog/blog.component';
import { ArticleCreateComponent } from './features/blogs/article-create.component';
import { ArticleShowComponent } from './features/blogs/article-show/article-show.component';
import { ArticleCreatedComponent } from './features/blogs/article-created/article-created.component';
import { ArticleFormComponent } from './features/blogs/article-form/article-form.component';
import { ArticleUpdateComponent } from './features/blogs/article-update.component';
import { ForgotPasswordComponent } from './features/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/user/reset-password/reset-password.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { UsersService } from './core/services/users.service';
import { MessagerieComponent } from './features/messagerie/messagerie.component';

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
    SchoolComponent,
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
    OverlayPanelModule,
    MessageModule,
    MessagesModule,
    AgGridModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    MessageService,
    UsersService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {
    // Enregistrement des modules AG Grid
    ModuleRegistry.registerModules([AllCommunityModule]);
  }
}
