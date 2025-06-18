import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/Alert';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  // Send a new alert
  showAlert(alert: Alert) {
    this.alertSubject.next(alert);

    if (alert.timeout && alert.timeout > 0) {
      setTimeout(() => this.clearAlert(), alert.timeout);
    }
  }

  // Convenience methods
  success(message: string, timeout = 3000) {
    this.showAlert({ type: 'success', message, timeout });
  }

  error(message: string, timeout = 5000) {
    this.showAlert({ type: 'error', message, timeout });
  }

  info(message: string, timeout = 3000) {
    this.showAlert({ type: 'info', message, timeout });
  }

  warning(message: string, timeout = 4000) {
    this.showAlert({ type: 'warning', message, timeout });
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}
