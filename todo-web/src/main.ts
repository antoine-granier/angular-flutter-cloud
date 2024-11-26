import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import environment
import { environment } from './app/app.config';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { HomeComponent } from './app/home/home.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { authGuard } from './app/auth.guard';
import { importProvidersFrom } from '@angular/core';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {   
  providers: [     
    importProvidersFrom(BrowserAnimationsModule),
    provideToastr(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),     
    provideFirestore(() => getFirestore()),     
    provideAuth(() => getAuth()),     
    provideRouter([       
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },     
      { path: 'login', component: LoginComponent },     
    ]),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ], 
}).catch(err => console.error(err));
