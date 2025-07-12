import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PdfService } from '../../services/pdf.service';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-pdf-button',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule
    ],
    template: `
        <!-- Raised Button Variant -->
        <button 
            *ngIf="variant === 'raised'"
            mat-raised-button 
            [color]="color"
            [disabled]="disabled || loadingService.isLoading()"
            [matMenuTriggerFor]="menu"
            class="pdf-button">
            <mat-icon>picture_as_pdf</mat-icon>
            {{ buttonText }}
            <mat-spinner *ngIf="loadingService.isLoading()" diameter="16"></mat-spinner>
        </button>

        <!-- Icon Button Variant -->
        <button 
            *ngIf="variant === 'icon'"
            mat-icon-button 
            [color]="color"
            [disabled]="disabled || loadingService.isLoading()"
            [matMenuTriggerFor]="menu"
            class="pdf-icon-button"
            matTooltip="PDF Options">
            <mat-icon>picture_as_pdf</mat-icon>
        </button>

        <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="handlePdfAction('view')">
                <mat-icon>open_in_new</mat-icon>
                <span>View PDF</span>
            </button>
            <button mat-menu-item (click)="handlePdfAction('download')">
                <mat-icon>download</mat-icon>
                <span>Download PDF</span>
            </button>
        </mat-menu>
    `,
    styles: [`
        .pdf-button {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .pdf-button mat-icon {
            margin-right: 4px;
        }
        
        .pdf-button mat-spinner {
            margin-left: 8px;
        }

        .pdf-icon-button {
            color: var(--primary-color);
        }

        .pdf-icon-button:hover {
            background-color: rgba(25, 118, 210, 0.04);
        }
        
        .mat-mdc-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .mat-mdc-menu-item mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
        }
    `]
})
export class PdfButtonComponent {
    @Input() invoiceId!: number;
    @Input() invoiceNumber!: string;
    @Input() buttonText: string = 'Generate PDF';
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() disabled: boolean = false;
    @Input() variant: 'raised' | 'icon' = 'raised';

    private pdfService = inject(PdfService);
    public loadingService = inject(LoadingService);

    async handlePdfAction(action: 'view' | 'download'): Promise<void> {
        if (!this.invoiceId || !this.invoiceNumber) {
            console.error('Invoice ID and Invoice Number are required');
            return;
        }

        try {
            await this.pdfService.handleInvoicePdf(this.invoiceId, this.invoiceNumber, action);
        } catch (error) {
            console.error('PDF generation failed:', error);
        }
    }
}
