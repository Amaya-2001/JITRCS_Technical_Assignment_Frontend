import { Component, Input, Output, EventEmitter, forwardRef, signal, computed, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Customer } from '../../../models/invoice.model';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'app-customer-autocomplete',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule
    ],
    template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [formControl]="searchControl"
        [matAutocomplete]="auto"
        [placeholder]="placeholder"
        autocomplete="off"
      >
      <mat-icon matSuffix>{{ selectedCustomerId ? 'check' : 'search' }}</mat-icon>
      <mat-autocomplete 
        #auto="matAutocomplete" 
        [displayWith]="displayCustomer"
        (optionSelected)="onCustomerSelected($event)"
        class="customer-autocomplete-panel"
      >
        <div class="autocomplete-options-container">
          <mat-option 
            *ngFor="let customer of filteredCustomers | async; trackBy: trackByCustomer" 
            [value]="customer"
            class="customer-option"
          >
            <div class="customer-content">
              <div class="customer-name">{{ customer.id }} - {{ customer.name }}</div>
              <div class="customer-email">{{ customer.email }}</div>
            </div>
          </mat-option>
          
          <mat-option 
            *ngIf="noCustomersFound" 
            disabled
            class="no-options"
          >
            No customers found
          </mat-option>
        </div>
      </mat-autocomplete>
      
      <mat-error *ngIf="hasError">
        <ng-content></ng-content>
      </mat-error>
    </mat-form-field>
  `,
    styleUrls: ['./customer-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomerAutocompleteComponent),
            multi: true
        }
    ]
})
export class CustomerAutocompleteComponent implements ControlValueAccessor, OnInit {
    @Input() customers = signal<Customer[]>([]);
    @Input() isLoading = false;
    @Input() hasError = false;
    @Input() label = 'Customer';
    @Input() placeholder = 'Search for a customer...';

    @Output() customerSelected = new EventEmitter<Customer>();

    searchControl = new FormControl('');
    selectedCustomerId: number | null = null;
    filteredCustomers: any;
    noCustomersFound = false;

    private onChange = (value: any) => { };
    private onTouched = () => { };

    ngOnInit() {
        this.filteredCustomers = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                const searchValue = typeof value === 'string' ? value : '';
                const filtered = this._filter(searchValue);
                this.noCustomersFound = searchValue !== '' && filtered.length === 0;
                return filtered;
            })
        );
    }

    private _filter(value: string): Customer[] {
        const filterValue = value.toLowerCase();
        return this.customers()
            .filter(customer =>
                customer.isActive && (
                    customer.name.toLowerCase().includes(filterValue) ||
                    customer.email.toLowerCase().includes(filterValue) ||
                    customer.id.toString().includes(filterValue)
                )
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 50); // Limit results for performance
    }

    displayCustomer = (customer: Customer): string => {
        return customer ? `${customer.id} - ${customer.name}` : '';
    };

    onCustomerSelected(event: any): void {
        const customer: Customer = event.option.value;
        this.selectedCustomerId = customer.id;
        this.customerSelected.emit(customer);
        this.onChange(customer.id);
        this.onTouched();
    }

    trackByCustomer = (index: number, customer: Customer): number => {
        return customer.id;
    };

    // ControlValueAccessor implementation
    writeValue(value: any): void {
        if (value) {
            const customer = this.customers().find(c => c.id === value);
            if (customer) {
                this.selectedCustomerId = value;
                this.searchControl.setValue(this.displayCustomer(customer), { emitEvent: false });
            }
        } else {
            this.selectedCustomerId = null;
            this.searchControl.setValue('', { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.searchControl.disable();
        } else {
            this.searchControl.enable();
        }
    }
}
