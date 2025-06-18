import { Component, OnDestroy } from '@angular/core';
import { AlertService } from '../services/alert-service';
import { Alert } from '../models/Alert';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnDestroy {
  alert: Alert | null = null;
  private subscription: Subscription;

  constructor(private alertService: AlertService) {
    this.subscription = this.alertService.alert$.subscribe(alert => this.alert = alert);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.alertService.clearAlert();
  }

  cssClass(type: string) {
    return type;
  }
}
