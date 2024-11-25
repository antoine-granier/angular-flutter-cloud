import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAmkfdoa3KrqUq4nPILciE08g03XU75VnM",
    authDomain: "angular-flutter-cloud-2f167.firebaseapp.com",
    projectId: "angular-flutter-cloud-2f167",
    storageBucket: "angular-flutter-cloud-2f167.firebasestorage.app",
    messagingSenderId: "990213572578",
    appId: "1:990213572578:web:55a90c1ecf3f51d9dc9bbb"
  },
};

