import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { AuthInterceptor } from '../app/service/auth.interceptor';
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
import { ToastModule } from 'primeng/toast';  // Assurez-vous que ce module est importé pour les toasts
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
import dayGridPlugin from '@fullcalendar/daygrid';

// Import de la locale française
import localeFr from '@angular/common/locales/fr';

// Enregistrer la locale française
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
    PublicationShowComponent
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
    ToastModule,  // Assurez-vous d'importer ToastModule ici
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
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   // useClass: AuthInterceptor,
    //   multi: true,
    // },
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    MessageService  // Assurez-vous d'ajouter le MessageService ici dans les providers
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
