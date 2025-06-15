import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ISignUpCredentials } from '../models/User';
import { UserService } from '../services/user-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['../signin/signin.component.css']
})
export class SignupComponent {
  credentials: ISignUpCredentials = {
    email: '',
    password: '',
    fullName: ''
  };
  confirmPassword: string = '';
  confirmPasswordTouched = false;
  signUpError: string | false = false;
  signUpSuccess = false;

  constructor(private userService: UserService, private router: Router) { }

  get confirmPasswordError(): boolean {
    return this.confirmPassword !== this.credentials.password;
  }

  signUp() {
    this.signUpError = false;
    this.signUpSuccess = false;

    if (this.confirmPasswordError) {
      return; // prevent submitting if passwords don't match
    }

    this.userService.signUp(this.credentials).subscribe({
      next: () => {
        this.signUpSuccess = true;
        this.signUpError = false;
      },
      error: (err) => {
        if (err.status === 409 && typeof err.error === 'string') {
          this.signUpError = err.error;
        } else if (typeof err.error === 'string') {
          this.signUpError = err.error;
        } else {
          this.signUpError = "Something went wrong. Please try again.";
        }
      },
    });
  }
}
