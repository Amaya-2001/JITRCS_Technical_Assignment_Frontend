import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class PdfService {
    private apiService = inject(ApiService);
    private notificationService = inject(NotificationService);

    /**
     * Generates and opens an invoice PDF in a new browser tab
     * @param invoiceId The ID of the invoice to generate PDF for
     * @param invoiceNumber The invoice number for filename
     */
    async generateAndOpenInvoicePdf(invoiceId: number, invoiceNumber: string): Promise<void> {
        try {
            const pdfBlob = await this.apiService.generateInvoicePdf(invoiceId).toPromise();

            if (!pdfBlob) {
                throw new Error('Failed to generate PDF');
            }

            this.openPdfInNewTab(pdfBlob, `Invoice_${invoiceNumber}_${this.getCurrentDateString()}.pdf`);
            this.notificationService.success('Invoice PDF generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.notificationService.error('Failed to generate PDF: ' + (error as Error).message);
            throw error;
        }
    }

    /**
     * Downloads an invoice PDF file
     * @param invoiceId The ID of the invoice to download PDF for
     * @param invoiceNumber The invoice number for filename
     */
    async downloadInvoicePdf(invoiceId: number, invoiceNumber: string): Promise<void> {
        try {
            const pdfBlob = await this.apiService.generateInvoicePdf(invoiceId).toPromise();

            if (!pdfBlob) {
                throw new Error('Failed to generate PDF');
            }

            this.downloadBlob(pdfBlob, `Invoice_${invoiceNumber}_${this.getCurrentDateString()}.pdf`);
            this.notificationService.success('Invoice PDF downloaded successfully!');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.notificationService.error('Failed to download PDF: ' + (error as Error).message);
            throw error;
        }
    }

    /**
     * Opens a PDF blob in a new browser tab
     * @param blob The PDF blob
     * @param filename The filename for the PDF
     */
    private openPdfInNewTab(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = filename;

        // For opening in new tab, we don't want to trigger download
        // Instead, we create a temporary URL and open it
        window.open(url, '_blank');

        // Clean up the object URL after a delay
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    /**
     * Downloads a PDF blob as a file
     * @param blob The PDF blob
     * @param filename The filename for the download
     */
    private downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Append to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        window.URL.revokeObjectURL(url);
    }

    /**
     * Gets current date as a string in YYYYMMDD format
     * @returns Date string
     */
    private getCurrentDateString(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * Checks if the browser supports PDF viewing
     * @returns True if PDF viewing is supported
     */
    isPdfViewingSupported(): boolean {
        // Check if the browser can display PDFs
        const mimeType = 'application/pdf';
        const mimeTypes = navigator.mimeTypes as any;
        const plugin = mimeTypes[mimeType];
        return !!(plugin && plugin.enabledPlugin);
    }

    /**
     * Utility method for other components to generate PDF with user choice
     * @param invoiceId The ID of the invoice
     * @param invoiceNumber The invoice number
     * @param action 'view' for opening in new tab, 'download' for downloading
     */
    async handleInvoicePdf(invoiceId: number, invoiceNumber: string, action: 'view' | 'download' = 'view'): Promise<void> {
        if (action === 'download') {
            await this.downloadInvoicePdf(invoiceId, invoiceNumber);
        } else {
            await this.generateAndOpenInvoicePdf(invoiceId, invoiceNumber);
        }
    }
}
