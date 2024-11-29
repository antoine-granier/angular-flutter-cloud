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
      imports: [LoginComponent], // Import standalone component
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

  describe('onSubmit', () => {
    it('should call authService.signIn with valid form values', async () => {
      // Set valid form values
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      // Call the method
      await component.onSubmit();

      // Verify that signIn was called with correct arguments
      expect(authServiceMock.signIn).toHaveBeenCalledWith('test@example.com', '123456');

      // Verify that there is no error message and isLoading is reset
      expect(component.errorMessage).toBe('');
      expect(component.isLoading).toBeFalse();
    });

    it('should show error message on failed login', async () => {
      // Mock signIn to reject with an error
      authServiceMock.signIn.and.returnValue(Promise.reject('Error'));

      // Set valid form values
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      // Call the method
      component.onSubmit();
      await fixture.whenStable(); // Wait for all promises to resolve/reject
      fixture.detectChanges(); // Apply changes to the DOM

      // Assert that errorMessage was set correctly
      expect(component.errorMessage).toBe('Erreur lors de la connexion. Vérifiez vos informations.');

      // Assert that ToastrService.error was called
      expect(toastrServiceMock.error).toHaveBeenCalledWith(
        'Erreur',
        'Erreur lors de la connexion. Vérifiez vos informations.'
      );

      // Verify that isLoading was reset
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('onSignUp', () => {
    it('should call authService.signUp with valid form values', async () => {
      // Set valid form values
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      // Call the method
      await component.onSignUp();

      // Verify that signUp was called with correct arguments
      expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', '123456');

      // Verify that there is no error message
      expect(component.errorMessage).toBe('');
    });

    it('should show error message on failed signup', async () => {
      // Mock signUp to reject with an error
      authServiceMock.signUp.and.returnValue(Promise.reject('Error'));

      // Set valid form values
      component.authForm.setValue({
        email: 'test@example.com',
        password: '123456',
      });

      // Call the method
      component.onSignUp();
      await fixture.whenStable(); // Wait for all promises to resolve/reject
      fixture.detectChanges(); // Apply changes to the DOM

      // Assert that errorMessage was set correctly
      expect(component.errorMessage).toBe('Erreur lors de l’inscription.');

      // Assert that ToastrService.error was called
      expect(toastrServiceMock.error).toHaveBeenCalledWith(
        'Erreur',
        'Erreur lors de l’inscription.'
      );
    });
  });
});
