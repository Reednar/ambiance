  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser'
  import { AppComponent } from './app.component';
  import { AppRoutingModule } from './app-routing.module';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { AppLayoutModule } from '../app/layout/app.layout.module';
  import { HTTP_INTERCEPTORS } from '@angular/common/http';
  import { AuthInterceptor } from '../app/service/auth.interceptor';

  @NgModule({
    declarations: [
      AppComponent,
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      AppLayoutModule
    ],
    bootstrap: [AppComponent],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
    ],
  })
  export class AppModule { }