import { Component, Input, Output, EventEmitter, forwardRef, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../models/invoice.model';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'app-product-autocomplete',
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
      <mat-icon matSuffix>{{ selectedProductId ? 'check' : 'search' }}</mat-icon>
      <mat-autocomplete 
        #auto="matAutocomplete" 
        [displayWith]="displayProduct"
        (optionSelected)="onProductSelected($event)"
        class="product-autocomplete-panel"
      >
        <div class="autocomplete-options-container">
          <mat-option 
            *ngFor="let product of filteredProducts | async; trackBy: trackByProduct" 
            [value]="product"
            class="product-option"
          >
            <div class="product-content">
              <div class="product-name">{{ product.id }} - {{ product.name }}</div>
              <div class="product-details">
                <span class="product-price">\${{ product.price.toFixed(2) }}</span>
                <span class="product-stock" [class.low-stock]="product.stockQuantity <= 5">
                  Stock: {{ product.stockQuantity }}
                </span>
              </div>
            </div>
          </mat-option>
          
          <mat-option 
            *ngIf="noProductsFound" 
            disabled
            class="no-options"
          >
            No products found
          </mat-option>
        </div>
      </mat-autocomplete>
      
      <mat-error *ngIf="hasError">
        <ng-content></ng-content>
      </mat-error>
    </mat-form-field>
  `,
    styleUrls: ['./product-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProductAutocompleteComponent),
            multi: true
        }
    ]
})
export class ProductAutocompleteComponent implements ControlValueAccessor, OnInit {
    @Input() products = signal<Product[]>([]);
    @Input() isLoading = false;
    @Input() hasError = false;
    @Input() label = 'Product';
    @Input() placeholder = 'Search for a product...';
    @Input() showStockInfo = true;
    @Input() showPriceInfo = true;

    @Output() productSelected = new EventEmitter<Product>();

    searchControl = new FormControl('');
    selectedProductId: number | null = null;
    filteredProducts: any;
    noProductsFound = false;

    private onChange = (value: any) => { };
    private onTouched = () => { };

    ngOnInit() {
        this.filteredProducts = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                const searchValue = typeof value === 'string' ? value : '';
                const filtered = this._filter(searchValue);
                this.noProductsFound = searchValue !== '' && filtered.length === 0;
                return filtered;
            })
        );
    }

    private _filter(value: string): Product[] {
        const filterValue = value.toLowerCase();
        return this.products()
            .filter(product =>
                product.isActive &&
                product.stockQuantity > 0 && (
                    product.name.toLowerCase().includes(filterValue) ||
                    product.description.toLowerCase().includes(filterValue) ||
                    product.category.toLowerCase().includes(filterValue) ||
                    product.id.toString().includes(filterValue)
                )
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 50); // Limit results for performance
    }

    displayProduct = (product: Product): string => {
        return product ? `${product.id} - ${product.name}` : '';
    };

    onProductSelected(event: any): void {
        const product: Product = event.option.value;
        this.selectedProductId = product.id;
        this.productSelected.emit(product);
        this.onChange(product.id);
        this.onTouched();
    }

    trackByProduct = (index: number, product: Product): number => {
        return product.id;
    };

    // ControlValueAccessor implementation
    writeValue(value: any): void {
        if (value) {
            const product = this.products().find(p => p.id === value);
            if (product) {
                this.selectedProductId = value;
                this.searchControl.setValue(this.displayProduct(product), { emitEvent: false });
            }
        } else {
            this.selectedProductId = null;
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
