import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { CustomerAutocompleteComponent } from '../shared/customer-autocomplete/customer-autocomplete.component';
import { ProductAutocompleteComponent } from '../shared/product-autocomplete/product-autocomplete.component';
import { Customer, Product } from '../../models/invoice.model';

@Component({
    selector: 'app-autocomplete-demo',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CustomerAutocompleteComponent,
        ProductAutocompleteComponent
    ],
    template: `
    <div class="demo-container" style="padding: 20px; max-width: 800px;">
      <h2>AutoComplete Components Demo</h2>
      
      <div style="margin-bottom: 30px;">
        <h3>Customer AutoComplete</h3>
        <app-customer-autocomplete
          [customers]="customers"
          [isLoading]="false"
          [hasError]="false"
          label="Select Customer"
          placeholder="Type to search customers..."
          [formControl]="customerControl"
          (customerSelected)="onCustomerSelected($event)"
        >
          Customer is required
        </app-customer-autocomplete>
        <p *ngIf="selectedCustomer">
          Selected: {{ selectedCustomer.id }} - {{ selectedCustomer.name }} ({{ selectedCustomer.email }})
        </p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3>Product AutoComplete</h3>
        <app-product-autocomplete
          [products]="products"
          [isLoading]="false"
          [hasError]="false"
          label="Select Product"
          placeholder="Type to search products..."
          [formControl]="productControl"
          (productSelected)="onProductSelected($event)"
        >
          Product is required
        </app-product-autocomplete>
        <p *ngIf="selectedProduct">
          Selected: {{ selectedProduct.id }} - {{ selectedProduct.name }} 
          (\${{ selectedProduct.price.toFixed(2) }}, Stock: {{ selectedProduct.stockQuantity }})
        </p>
      </div>

      <div>
        <h3>Form Values</h3>
        <p>Customer Control Value: {{ customerControl.value }}</p>
        <p>Product Control Value: {{ productControl.value }}</p>
      </div>
    </div>
  `
})
export class AutocompleteDemoComponent {
    customerControl = new FormControl(null);
    productControl = new FormControl(null);

    selectedCustomer: Customer | null = null;
    selectedProduct: Product | null = null;

    // Mock data for demo
    customers = signal<Customer[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St', isActive: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Oak Ave', isActive: true },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', address: '789 Pine Rd', isActive: true },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '444-987-6543', address: '321 Elm St', isActive: true },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '777-555-3333', address: '654 Maple Dr', isActive: true }
    ]);

    products = signal<Product[]>([
        { id: 1, name: 'Gaming Mouse', description: 'High precision gaming mouse', price: 59.99, category: 'Accessories', stockQuantity: 25, isActive: true },
        { id: 2, name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 129.99, category: 'Accessories', stockQuantity: 15, isActive: true },
        { id: 3, name: 'Graphics Card', description: 'High-end graphics card', price: 599.99, category: 'Components', stockQuantity: 8, isActive: true },
        { id: 4, name: 'SSD 1TB', description: 'Fast solid state drive', price: 89.99, category: 'Storage', stockQuantity: 30, isActive: true },
        { id: 5, name: 'Monitor 27"', description: '4K gaming monitor', price: 299.99, category: 'Display', stockQuantity: 12, isActive: true },
        { id: 6, name: 'CPU Cooler', description: 'Liquid cooling system', price: 149.99, category: 'Cooling', stockQuantity: 3, isActive: true }
    ]);

    onCustomerSelected(customer: Customer): void {
        this.selectedCustomer = customer;
        console.log('Customer selected:', customer);
    }

    onProductSelected(product: Product): void {
        this.selectedProduct = product;
        console.log('Product selected:', product);
    }
}
