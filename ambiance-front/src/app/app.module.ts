  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser'
  import { AppComponent } from './app.component';
  import { AppRoutingModule } from './app-routing.module';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { NavbarComponent } from './navbar/navbar.component';
  import { HomeComponent } from './pages/home/home.component';
  import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
  import { AuthInterceptor } from '../app/service/auth.interceptor';
  import { CommonModule } from '@angular/common';
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
  import { MenuModule } from 'primeng/menu'
  import { OverlayModule } from 'primeng/overlay';
  import { OverlayPanelModule } from 'primeng/overlaypanel';
  import { MessageService } from 'primeng/api';
  import { MessagesModule } from 'primeng/messages';
  import { MessageModule } from 'primeng/message';
  import { PublicationsCreateFormComponent } from './pages/publications-create-form/publications-create-form.component';
  import { ProfileComponent } from './pages/user/profile/profile.component';
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
      ProfileComponent
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
      CheckboxModule,
      ReactiveFormsModule,
      MultiSelectModule,
      CalendarModule,
      InputTextModule,
      InputTextareaModule,
      ReactiveFormsModule,
      TagModule,
      CommonModule,
      ReactiveFormsModule,
      CalendarModule,
      FormsModule,
      ToastModule,
      StepsModule,
      InputTextModule,
      InputTextareaModule,
      ButtonModule,
      DropdownModule,
      MultiSelectModule,
      CheckboxModule,
      CalendarModule,
      FullCalendarModule,
      HttpClientModule,
      MenuModule,
      OverlayModule,
      OverlayPanelModule,
      MessageModule,
      MessagesModule
    ],
    bootstrap: [AppComponent],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

  })
  export class AppModule { }