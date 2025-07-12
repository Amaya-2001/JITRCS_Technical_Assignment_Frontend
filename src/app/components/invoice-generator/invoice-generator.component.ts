import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../../services/api.service';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { PdfService } from '../../services/pdf.service';
import { Customer, Product, CreateInvoice, InvoiceItem } from '../../models/invoice.model';
import { CustomerAutocompleteComponent } from '../shared/customer-autocomplete/customer-autocomplete.component';
import { ProductAutocompleteComponent } from '../shared/product-autocomplete/product-autocomplete.component';

@Component({
    selector: 'app-invoice-generator',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        CustomerAutocompleteComponent,
        ProductAutocompleteComponent
    ],
    templateUrl: './invoice-generator.component.html',
    styleUrl: './invoice-generator.component.scss'
})
export class InvoiceGeneratorComponent implements OnInit, OnDestroy {
    private apiService = inject(ApiService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    public loadingService = inject(LoadingService);
    private notificationService = inject(NotificationService);
    private pdfService = inject(PdfService);
    private destroy$ = new Subject<void>();

    customers = signal<Customer[]>([]);
    products = signal<Product[]>([]);

    // Reactive signals for totals
    formValues = signal<any>({});

    invoiceForm: FormGroup;

    // Computed values for totals - now reactive to form changes
    subtotal = computed(() => {
        const formData = this.formValues();
        const items = formData.items || [];
        return items.reduce((sum: number, item: any) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unitPrice) || 0;
            return sum + (quantity * unitPrice);
        }, 0);
    });

    discountAmount = computed(() => {
        const subtotalValue = this.subtotal();
        const formData = this.formValues();
        const discountPercent = parseFloat(formData.discountPercentage) || 0;
        return (subtotalValue * (discountPercent / 100));
    });

    totalAmount = computed(() => {
        const subtotalValue = this.subtotal();
        const discountValue = this.discountAmount();
        return (subtotalValue - discountValue);
    });

    balanceAmount = computed(() => {
        const totalValue = this.totalAmount();
        const formData = this.formValues();
        const paidValue = parseFloat(formData.paidAmount) || 0;
        return (totalValue - paidValue);
    });

    // Make parseFloat available in template
    parseFloat = parseFloat;

    constructor() {
        this.invoiceForm = this.fb.group({
            customerId: ['', Validators.required],
            transactionDate: [new Date(), Validators.required],
            discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
            paidAmount: [0, Validators.min(0)],
            items: this.fb.array([this.createItemFormGroup()])
        });
    }

    ngOnInit(): void {
        this.loadCustomers();
        this.loadProducts();
        this.setupFormSubscriptions();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupFormSubscriptions(): void {
        // Subscribe to form value changes and update the signal
        this.invoiceForm.valueChanges
            .pipe(
                debounceTime(100), // Debounce to avoid excessive calculations
                takeUntil(this.destroy$)
            )
            .subscribe(value => {
                this.formValues.set(value);
            });

        // Initial form value
        this.formValues.set(this.invoiceForm.value);
    }

    get itemsFormArray(): FormArray {
        return this.invoiceForm.get('items') as FormArray;
    }

    createItemFormGroup(): FormGroup {
        return this.fb.group({
            productId: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            unitPrice: ['', [Validators.required, Validators.min(0.01)]]
        });
    }

    getItemFormGroup(index: number): FormGroup {
        return this.itemsFormArray.at(index) as FormGroup;
    }

    addProduct(): void {
        this.itemsFormArray.push(this.createItemFormGroup());
        // Update form values signal immediately
        this.formValues.set(this.invoiceForm.value);
    }

    removeProduct(index: number): void {
        if (this.itemsFormArray.length > 1) {
            this.itemsFormArray.removeAt(index);
            // Update form values signal immediately
            this.formValues.set(this.invoiceForm.value);
        }
    }

    onProductChange(index: number, productId: number): void {
        const product = this.products().find(p => p.id === productId);
        if (product) {
            const itemGroup = this.getItemFormGroup(index);
            itemGroup.patchValue({
                unitPrice: product.price
            });
            // Form values will be updated automatically via valueChanges subscription
        }
    }

    onCustomerChange(customer: Customer): void {
        // Handle customer selection if needed
        console.log('Customer selected:', customer);
    }

    // Helper methods for template display with proper formatting
    getSubtotalFormatted(): string {
        return this.subtotal().toFixed(2);
    }

    getDiscountAmountFormatted(): string {
        return this.discountAmount().toFixed(2);
    }

    getTotalAmountFormatted(): string {
        return this.totalAmount().toFixed(2);
    }

    getBalanceAmountFormatted(): string {
        return this.balanceAmount().toFixed(2);
    }

    getLineTotal(index: number): string {
        const itemGroup = this.getItemFormGroup(index);
        const quantity = parseFloat(itemGroup.get('quantity')?.value) || 0;
        const unitPrice = parseFloat(itemGroup.get('unitPrice')?.value) || 0;
        return (quantity * unitPrice).toFixed(2);
    }

    private async loadCustomers(): Promise<void> {
        try {
            this.loadingService.show();
            const customers = await this.apiService.getCustomers().toPromise();
            this.customers.set(customers || []);
        } catch (error) {
            this.notificationService.error('Failed to load customers: ' + (error as Error).message);
        } finally {
            this.loadingService.hide();
        }
    }

    private async loadProducts(): Promise<void> {
        try {
            this.loadingService.show();
            const products = await this.apiService.getProducts().toPromise();
            this.products.set(products || []);
        } catch (error) {
            this.notificationService.error('Failed to load products: ' + (error as Error).message);
        } finally {
            this.loadingService.hide();
        }
    }

    async onSubmit(): Promise<void> {
        if (this.invoiceForm.valid) {
            try {
                this.loadingService.show();

                // Validate stock availability for all items
                const items = this.invoiceForm.get('items')?.value;
                for (const item of items) {
                    const stockCheck = await this.apiService.checkStockAvailability(item.productId, item.quantity).toPromise();
                    if (!stockCheck?.isAvailable) {
                        const product = this.products().find(p => p.id === item.productId);
                        throw new Error(`Insufficient stock for ${product?.name || 'product'}`);
                    }
                }

                const formValue = this.invoiceForm.value;
                const invoice: CreateInvoice = {
                    customerId: formValue.customerId,
                    transactionDate: formValue.transactionDate.toISOString(),
                    discountPercentage: formValue.discountPercentage || 0,
                    paidAmount: formValue.paidAmount || 0,
                    items: formValue.items
                };

                const result = await this.apiService.createInvoice(invoice).toPromise();

                if (result) {
                    this.notificationService.success(`Invoice ${result.invoiceNumber} created successfully!`);

                    // Generate and open PDF in new tab
                    try {
                        await this.pdfService.generateAndOpenInvoicePdf(result.id, result.invoiceNumber);
                    } catch (pdfError) {
                        // PDF generation failed, but invoice was created successfully
                        console.error('PDF generation failed:', pdfError);
                        this.notificationService.warning('Invoice created successfully, but PDF generation failed.');
                    }

                    this.resetForm();

                    // Refresh products to update stock quantities
                    await this.loadProducts();
                }

            } catch (error) {
                this.notificationService.error('Failed to create invoice: ' + (error as Error).message);
            } finally {
                this.loadingService.hide();
            }
        } else {
            this.notificationService.warning('Please fill in all required fields correctly.');
        }
    }

    resetForm(): void {
        this.invoiceForm.reset({
            customerId: '',
            transactionDate: new Date(),
            discountPercentage: 0,
            paidAmount: 0
        });

        // Reset items array to have one empty item
        while (this.itemsFormArray.length > 1) {
            this.itemsFormArray.removeAt(1);
        }

        this.getItemFormGroup(0).reset();

        // Update form values signal immediately
        this.formValues.set(this.invoiceForm.value);
    }
}
