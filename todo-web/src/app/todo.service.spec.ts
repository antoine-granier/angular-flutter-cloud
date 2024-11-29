import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let firestoreMock: any;
  let afAuthMock: any;
  let toastrMock: any;
  let routerMock: any;

  beforeEach(() => {
    // Mock Firestore
    firestoreMock = {
      collection: jasmine.createSpy('collection').and.returnValue({}),
      addDoc: jasmine.createSpy('addDoc').and.returnValue(Promise.resolve()),
    };

    // Mock AngularFireAuth
    afAuthMock = {
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword').and.returnValue(
        Promise.resolve({ user: { email: 'test@example.com', uid: '12345' } })
      ),
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(
        Promise.resolve({ user: { email: 'test@example.com', uid: '12345' } })
      ),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
    };

    // Mock ToastrService
    toastrMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };

    // Mock Router
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: AngularFireAuth, useValue: afAuthMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerMock },
      ],
    });

  });

  it('should be created', () => {
  });

  
});
