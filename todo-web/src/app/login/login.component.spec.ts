import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let toastrServiceMock: any;

  beforeEach(async () => {
    // Mocking AuthService
    authServiceMock = {
      signIn: jasmine.createSpy('signIn').and.returnValue(Promise.resolve()),
      signUp: jasmine.createSpy('signUp').and.returnValue(Promise.resolve()),
    };

    // Mocking ToastrService
    toastrServiceMock = {
      error: jasmine.createSpy('error'),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should create a form with email and password controls', () => {
      expect(component.authForm.contains('email')).toBeTrue();
      expect(component.authForm.contains('password')).toBeTrue();
    });

    it('should require email and password', () => {
      const emailControl = component.authForm.get('email');
      const passwordControl = component.authForm.get('password');

      emailControl?.setValue('');
      passwordControl?.setValue('');

      expect(emailControl?.valid).toBeFalse();
      expect(passwordControl?.valid).toBeFalse();
    });

    it('should validate email format', () => {
      const emailControl = component.authForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();

      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should enforce password length of at least 6 characters', () => {
      const passwordControl = component.authForm.get('password');

      passwordControl?.setValue('123');
      expect(passwordControl?.valid).toBeFalse();

      passwordControl?.setValue('123456');
      expect(passwordControl?.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should call authService.signIn with valid form values', async () => {
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      await component.onSubmit();

      expect(authServiceMock.signIn).toHaveBeenCalledWith('test@example.com', '123456');
      expect(component.errorMessage).toBe('');
      expect(component.isLoading).toBeFalse();
    });

    it('should show error message on failed login', async () => {
      authServiceMock.signIn.and.returnValue(Promise.reject('Error'));

      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      await component.onSubmit();

      expect(authServiceMock.signIn).toHaveBeenCalledWith('test@example.com', '123456');
      expect(component.errorMessage).toBe('Erreur lors de la connexion. Vérifiez vos informations.');
      expect(toastrServiceMock.error).toHaveBeenCalledWith('Erreur', 'Erreur lors de la connexion. Vérifiez vos informations.');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('onSignUp', () => {
    it('should call authService.signUp with valid form values', async () => {
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      await component.onSignUp();

      expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', '123456');
      expect(component.errorMessage).toBe('');
    });

    it('should show error message on failed signup', async () => {
      authServiceMock.signUp.and.returnValue(Promise.reject('Error'));

      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      await component.onSignUp();

      expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', '123456');
      expect(component.errorMessage).toBe('Erreur lors de l’inscription.');
      expect(toastrServiceMock.error).toHaveBeenCalledWith('Erreur', 'Erreur lors de l’inscription.');
    });
  });
});
