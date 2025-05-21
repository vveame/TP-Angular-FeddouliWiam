import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IUserCredentials } from '../models/User';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  credentials: IUserCredentials = { email: '', password: '' };
  signInError: boolean = false;

  constructor(private UserService: UserService, private router: Router) { }

  signIn() {
    this.signInError = false;
    this.UserService.signIn(this.credentials).subscribe({
      next: () => this.router.navigate(['/catalog']),
      error: () => (this.signInError = true)
    });
  }
}
