import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SharedModule } from '../shared.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, SharedModule],
  standalone: true,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  authForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private toastr: ToastrService) {
    // Initialisation du formulaire
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Connexion
  onSubmit() {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      this.isLoading = true;
      this.authService
        .signIn(email, password)
        .then(() => {
          this.errorMessage = '';
          this.isLoading = false;
        })
        .catch((err) => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la connexion. Vérifiez vos informations.';
          this.toastr.error('Erreur', this.errorMessage);
        });
    }
  }

  // Inscription
  onSignUp() {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      this.authService
        .signUp(email, password)
        .then(() => {
          this.errorMessage = '';
        })
        .catch((err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors de l’inscription.';
          this.toastr.error('Erreur', this.errorMessage);
        });
    }
  }
}
