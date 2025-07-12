import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { InvoiceResponse } from '../../models/invoice.model';
import { PdfButtonComponent } from '../pdf-button/pdf-button.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    CurrencyPipe,
    DatePipe,
    PdfButtonComponent
  ],
  template: `
    <div class="invoice-list">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt_long</mat-icon>
            Invoice History
          </mat-card-title>
          <mat-card-subtitle>View all generated invoices</mat-card-subtitle>
        </mat-card-header>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div *ngIf="loadingService.isLoading()" class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading invoices...</p>
          </div>

          <div *ngIf="!loadingService.isLoading() && invoices().length === 0" class="no-data">
            <mat-icon>inbox</mat-icon>
            <h3>No Invoices Found</h3>
            <p>No invoices have been generated yet.</p>
            <button mat-raised-button color="primary" routerLink="/generate-invoice">
              <mat-icon>add</mat-icon>
              Generate First Invoice
            </button>
          </div>

          <div *ngIf="!loadingService.isLoading() && invoices().length > 0" class="table-container">
            <table mat-table [dataSource]="invoices()" class="invoices-table">
              
              <!-- Invoice Number Column -->
              <ng-container matColumnDef="invoiceNumber">
                <th mat-header-cell *matHeaderCellDef>Invoice #</th>
                <td mat-cell *matCellDef="let invoice">
                  <strong>{{ invoice.invoiceNumber }}</strong>
                </td>
              </ng-container>

              <!-- Customer Column -->
              <ng-container matColumnDef="customerName">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let invoice">{{ invoice.customerName }}</td>
              </ng-container>

              <!-- Date Column -->
              <ng-container matColumnDef="transactionDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let invoice">
                  {{ invoice.transactionDate | date:'shortDate' }}
                </td>
              </ng-container>

              <!-- Total Amount Column -->
              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let invoice">
                  <strong>{{ invoice.totalAmount | currency }}</strong>
                </td>
              </ng-container>

              <!-- Paid Amount Column -->
              <ng-container matColumnDef="paidAmount">
                <th mat-header-cell *matHeaderCellDef>Paid</th>
                <td mat-cell *matCellDef="let invoice">
                  {{ invoice.paidAmount | currency }}
                </td>
              </ng-container>

              <!-- Balance Column -->
              <ng-container matColumnDef="balanceAmount">
                <th mat-header-cell *matHeaderCellDef>Balance</th>
                <td mat-cell *matCellDef="let invoice">
                  <span [class.paid]="invoice.balanceAmount === 0" 
                        [class.balance-due]="invoice.balanceAmount > 0">
                    {{ invoice.balanceAmount | currency }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let invoice">
                  <div class="actions-container">
                    <button mat-icon-button (click)="viewInvoice(invoice.id)" 
                            matTooltip="View Details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <app-pdf-button 
                        [invoiceId]="invoice.id"
                        [invoiceNumber]="invoice.invoiceNumber"
                        buttonText=""
                        color="primary"
                        variant="icon">
                    </app-pdf-button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .invoice-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-card {
      margin-bottom: 20px;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      text-align: center;
      color: #666;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        color: #ccc;
      }

      h3 {
        margin: 0 0 8px 0;
        color: #333;
      }

      p {
        margin: 0 0 24px 0;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .invoices-table {
      width: 100%;
      min-width: 600px;
    }

    .paid {
      color: #4caf50;
      font-weight: bold;
    }

    .balance-due {
      color: #f44336;
      font-weight: bold;
    }

    .actions-container {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    @media (max-width: 768px) {
      .invoice-list {
        padding: 10px;
      }

      .invoices-table {
        font-size: 14px;
      }
    }
  `]
})
export class InvoiceListComponent implements OnInit {
  private apiService = inject(ApiService);
  public loadingService = inject(LoadingService);
  private notificationService = inject(NotificationService);

  invoices = signal<InvoiceResponse[]>([]);
  displayedColumns: string[] = [
    'invoiceNumber',
    'customerName',
    'transactionDate',
    'totalAmount',
    'paidAmount',
    'balanceAmount',
    'actions'
  ];

  ngOnInit(): void {
    this.loadInvoices();
  }

  private async loadInvoices(): Promise<void> {
    try {
      this.loadingService.show();
      const invoices = await this.apiService.getInvoices().toPromise();
      this.invoices.set(invoices || []);
    } catch (error) {
      this.notificationService.error('Failed to load invoices: ' + (error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  viewInvoice(id: number): void {
    // For now, just show a message. In a real app, you'd navigate to a detail view
    this.notificationService.info(`Viewing invoice details for ID: ${id}`);
  }
}
