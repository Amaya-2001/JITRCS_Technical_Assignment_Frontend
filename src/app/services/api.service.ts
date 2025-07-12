import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Customer, Product, CreateInvoice, InvoiceResponse } from '../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;

    // Customer endpoints
    getCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.baseUrl}/customers`)
            .pipe(catchError(this.handleError));
    }

    getCustomerById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`)
            .pipe(catchError(this.handleError));
    }

    createCustomer(customer: Omit<Customer, 'id' | 'isActive'>): Observable<Customer> {
        return this.http.post<Customer>(`${this.baseUrl}/customers`, customer)
            .pipe(catchError(this.handleError));
    }

    // Product endpoints
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products`)
            .pipe(catchError(this.handleError));
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`)
            .pipe(catchError(this.handleError));
    }

    getProductsByCategory(category: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/products/category/${category}`)
            .pipe(catchError(this.handleError));
    }

    checkStockAvailability(productId: number, quantity: number): Observable<{ isAvailable: boolean }> {
        return this.http.get<{ isAvailable: boolean }>(`${this.baseUrl}/products/${productId}/stock-check?quantity=${quantity}`)
            .pipe(catchError(this.handleError));
    }

    // Invoice endpoints
    createInvoice(invoice: CreateInvoice): Observable<InvoiceResponse> {
        return this.http.post<InvoiceResponse>(`${this.baseUrl}/invoices`, invoice)
            .pipe(catchError(this.handleError));
    }

    getInvoices(): Observable<InvoiceResponse[]> {
        return this.http.get<InvoiceResponse[]>(`${this.baseUrl}/invoices`)
            .pipe(catchError(this.handleError));
    }

    getInvoiceById(id: number): Observable<InvoiceResponse> {
        return this.http.get<InvoiceResponse>(`${this.baseUrl}/invoices/${id}`)
            .pipe(catchError(this.handleError));
    }

    getInvoicesByCustomerId(customerId: number): Observable<InvoiceResponse[]> {
        return this.http.get<InvoiceResponse[]>(`${this.baseUrl}/invoices/customer/${customerId}`)
            .pipe(catchError(this.handleError));
    }

    // PDF generation endpoint
    generateInvoicePdf(invoiceId: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/invoices/${invoiceId}/pdf`, {
            responseType: 'blob'
        }).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Backend error
            if (error.status === 400 && error.error) {
                errorMessage = typeof error.error === 'string' ? error.error : 'Validation error occurred';
            } else if (error.status === 404) {
                errorMessage = 'Resource not found';
            } else if (error.status === 500) {
                errorMessage = 'Internal server error';
            } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
        }

        console.error('API Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
