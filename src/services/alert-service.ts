import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../models/Alert';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  showAlert(alert: Alert) {
    const current = this.alertsSubject.value;
    this.alertsSubject.next([...current, alert]);

    if (alert.timeout && alert.timeout > 0) {
      setTimeout(() => this.removeAlert(alert), alert.timeout);
    }
  }

  removeAlert(alert: Alert) {
    const filtered = this.alertsSubject.value.filter(a => a !== alert);
    this.alertsSubject.next(filtered);
  }

  clearAlerts() {
    this.alertsSubject.next([]);
  }

  // Méthodes d’aide
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
}
