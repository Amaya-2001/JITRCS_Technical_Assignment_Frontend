# AutoComplete Components

This package provides reusable AutoComplete components for Customer and Product selection, following Angular Material Design principles and industry best practices.

## Features

- **Type-ahead search** with real-time filtering
- **Keyboard navigation** support (arrow keys, enter, escape)
- **Accessibility compliant** (ARIA labels, screen reader support)
- **Customizable scrollbar** for large datasets
- **Form validation** integration with Angular Reactive Forms
- **Dark theme** support
- **Performance optimized** with limited results and trackBy functions
- **Responsive design** that works on mobile and desktop

## Components

### CustomerAutocompleteComponent

Provides autocomplete functionality for customer selection with ID and name display format.

#### Usage

```typescript
import { CustomerAutocompleteComponent } from './components/shared/customer-autocomplete/customer-autocomplete.component';

// In your component
customers = signal<Customer[]>([...]);

onCustomerSelected(customer: Customer) {
  console.log('Selected customer:', customer);
}
```

```html
<app-customer-autocomplete
  [customers]="customers"
  [isLoading]="false"
  [hasError]="false"
  label="Customer"
  placeholder="Search for a customer..."
  formControlName="customerId"
  (customerSelected)="onCustomerSelected($event)"
>
  Customer is required
</app-customer-autocomplete>
```

#### Inputs

- `customers: Signal<Customer[]>` - Array of customers to search from
- `isLoading: boolean` - Shows loading state (default: false)
- `hasError: boolean` - Shows error state (default: false)
- `label: string` - Field label (default: 'Customer')
- `placeholder: string` - Placeholder text (default: 'Search for a customer...')

#### Outputs

- `customerSelected: EventEmitter<Customer>` - Emitted when a customer is selected

### ProductAutocompleteComponent

Provides autocomplete functionality for product selection with ID, name, price, and stock information.

#### Usage

```typescript
import { ProductAutocompleteComponent } from './components/shared/product-autocomplete/product-autocomplete.component';

// In your component
products = signal<Product[]>([...]);

onProductSelected(product: Product) {
  console.log('Selected product:', product);
}
```

```html
<app-product-autocomplete
  [products]="products"
  [isLoading]="false"
  [hasError]="false"
  label="Product"
  placeholder="Search for a product..."
  formControlName="productId"
  (productSelected)="onProductSelected($event)"
>
  Product is required
</app-product-autocomplete>
```

#### Inputs

- `products: Signal<Product[]>` - Array of products to search from
- `isLoading: boolean` - Shows loading state (default: false)
- `hasError: boolean` - Shows error state (default: false)
- `label: string` - Field label (default: 'Product')
- `placeholder: string` - Placeholder text (default: 'Search for a product...')
- `showStockInfo: boolean` - Shows stock information (default: true)
- `showPriceInfo: boolean` - Shows price information (default: true)

#### Outputs

- `productSelected: EventEmitter<Product>` - Emitted when a product is selected

## Form Integration

Both components implement `ControlValueAccessor` and work seamlessly with Angular Reactive Forms:

```typescript
// In your component
form = this.fb.group({
  customerId: ['', Validators.required],
  productId: ['', Validators.required]
});

// Access values
const customerId = this.form.get('customerId')?.value;
const productId = this.form.get('productId')?.value;
```

## Search Functionality

- **Customer Search**: Searches by customer ID, name, and email
- **Product Search**: Searches by product ID, name, description, and category
- **Case-insensitive** matching
- **Real-time filtering** as user types
- **Performance optimized** with result limiting (50 items max)

## Accessibility Features

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- Error announcement

## Styling

The components use Material Design theming and support:

- Light and dark themes
- Custom scrollbars
- Responsive design
- Consistent typography
- Visual feedback states (hover, focus, selected)

## Error Handling

Error messages are displayed using Angular Material's error system:

```html
<app-customer-autocomplete formControlName="customerId" [hasError]="form.get('customerId')?.invalid">
  <div *ngIf="form.get('customerId')?.hasError('required')">
    Customer is required
  </div>
</app-customer-autocomplete>
```

## Performance Considerations

- Results are limited to 50 items for optimal performance
- TrackBy functions prevent unnecessary re-renders
- OnPush change detection strategy (where applicable)
- Debounced search to reduce API calls (can be added)
- Virtual scrolling support (can be added for very large datasets)

## Best Practices

1. **Always provide trackBy functions** for *ngFor loops
2. **Limit result sets** to improve performance
3. **Use signals** for reactive data updates
4. **Implement proper error handling** with form validation
5. **Provide meaningful labels and placeholders** for accessibility
6. **Test with keyboard navigation** to ensure accessibility
7. **Consider loading states** for async data
