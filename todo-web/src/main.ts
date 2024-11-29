import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { importProvidersFrom } from '@angular/core';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideToastr(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideRouter(routes),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
}).catch(err => console.error(err));
