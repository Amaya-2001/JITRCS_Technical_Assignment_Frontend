import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, MatSnackBarModule, MatIconModule, MatButtonModule],
    template: `
    <div *ngIf="notificationService.notification()" class="notification" 
         [class]="'notification-' + notificationService.notification()?.type">
      <div class="notification-content">
        <mat-icon class="notification-icon">
          {{ getIcon() }}
        </mat-icon>
        <span class="notification-message">{{ notificationService.notification()?.message }}</span>
        <button mat-icon-button (click)="close()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      min-width: 300px;
      max-width: 500px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notification-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .notification-message {
      flex: 1;
      font-weight: 500;
    }

    .close-button {
      margin-left: auto;
    }

    .notification-success {
      background-color: #4caf50;
      color: white;
    }

    .notification-error {
      background-color: #f44336;
      color: white;
    }

    .notification-warning {
      background-color: #ff9800;
      color: white;
    }

    .notification-info {
      background-color: #2196f3;
      color: white;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent {
    public notificationService = inject(NotificationService);

    getIcon(): string {
        const type = this.notificationService.notification()?.type;
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'info';
        }
    }

    close(): void {
        this.notificationService.clear();
    }
}
