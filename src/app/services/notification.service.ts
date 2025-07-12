import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    public notification = signal<NotificationMessage | null>(null);
    private timeoutId: any;

    show(notification: NotificationMessage): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.notification.set(notification);

        const duration = notification.duration || 5000;
        this.timeoutId = setTimeout(() => {
            this.clear();
        }, duration);
    }

    success(message: string, duration?: number): void {
        this.show({ type: 'success', message, duration });
    }

    error(message: string, duration?: number): void {
        this.show({ type: 'error', message, duration });
    }

    info(message: string, duration?: number): void {
        this.show({ type: 'info', message, duration });
    }

    warning(message: string, duration?: number): void {
        this.show({ type: 'warning', message, duration });
    }

    clear(): void {
        this.notification.set(null);
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
