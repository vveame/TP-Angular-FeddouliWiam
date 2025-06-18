import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user-service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TP2';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(); // triggers /api/me if cookie exists
  }
}
