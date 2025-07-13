# MC Computers Frontend

A modern Angular 20 application for managing customers, products, and invoices for MC Computers. This application provides a user-friendly interface for business operations including customer management, product catalog, and invoice generation with PDF export capabilities.

## Technology Stack

- **Angular 20** - Frontend framework
- **Angular Material** - UI component library
- **TypeScript** - Programming language
- **RxJS** - Reactive programming library
- **Angular SSR** - Server-side rendering support
- **Day.js** - Date manipulation library
- **SCSS** - Styling

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.19.0 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (version 20.1.0)

### Install Angular CLI globally:
```bash
npm install -g @angular/cli@20.1.0
```

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mc-computers-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Update the API URL in `src/environments/environment.ts` to match your backend server:

```typescript
export const environment = {
    production: false,
    apiUrl: 'https://localhost:7228/api' // Update this to your backend URL
};
```

For production, update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
    production: true,
    apiUrl: 'https://your-production-api-url/api'
};
```

## Running the Application

### Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200/`. The app will automatically reload when you make changes to the source files.

### Development Server with Custom Port
```bash
ng serve --port 4201
```

### Production Build
```bash
ng build
```
Build artifacts will be stored in the `dist/` directory.

### Production Build with Optimization
```bash
ng build --configuration production
```

## Available Scripts

- `ng serve` - Start development server
- `ng build` - Build the application
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests
- `ng generate component component-name` - Generate new component

## Application Features

### Customer Management
- View all customers in a data table
- Add new customers with contact information
- Edit existing customer details
- Delete customers (with confirmation)
- Search and filter customers

### Product Management
- Browse product catalog
- Add new products with pricing and inventory
- Update product information
- Remove products from catalog
- Category-based organization

### Invoice Management
- Create new invoices with multiple line items
- Select customers and products
- Calculate totals automatically
- View invoice history
- Generate and download PDF invoices
- Edit and update existing invoices

### PDF Generation
- Professional invoice PDF layout
- Company branding and information
- Itemized billing details
- Tax calculations
- Customer and invoice information

## Project Structure

```
src/
├── app/
│   ├── components/           # Feature components
│   │   ├── customers/        # Customer management
│   │   ├── products/         # Product management
│   │   ├── invoices/         # Invoice management
│   │   └── shared/           # Shared components
│   ├── services/             # API and business logic services
│   ├── models/               # TypeScript interfaces and models
│   ├── guards/               # Route guards
│   └── interceptors/         # HTTP interceptors
├── environments/             # Environment configurations
├── assets/                   # Static assets (images, icons)
└── styles/                   # Global styles
```

## API Integration

The application integrates with the MC Computers Backend API. Ensure the backend server is running before starting the frontend application.

### API Endpoints Used:
- `GET /api/customers` - Fetch customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/products` - Fetch products
- `POST /api/products` - Create product
- `GET /api/invoices` - Fetch invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/{id}/pdf` - Download invoice PDF

## Development Guidelines

### Code Generation
Angular CLI includes powerful code scaffolding tools:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Generate a new module
ng generate module module-name

# Generate a new interface
ng generate interface interface-name
```

### Building and Testing

#### Build for Production
```bash
ng build --configuration production
```

#### Run Unit Tests
```bash
ng test
```

#### Run End-to-End Tests
```bash
ng e2e
```

#### Code Linting
```bash
ng lint
```

## Styling and Theming

The application uses Angular Material for UI components and SCSS for custom styling.

### Material Theme
- Primary color: Blue
- Accent color: Orange
- Responsive design
- Dark/Light theme support

### Custom Styles
Global styles are defined in `src/styles.scss`. Component-specific styles are in individual component `.scss` files.

## Browser Support

The application supports the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- **Lazy Loading**: Feature modules are lazy-loaded
- **OnPush Change Detection**: Used where appropriate
- **TrackBy Functions**: Implemented for efficient list rendering
- **AOT Compilation**: Enabled by default
- **Tree Shaking**: Unused code is removed in production builds

## Development Assumptions

1. **Backend API**: Assumes the MC Computers Backend API is running and accessible
2. **Authentication**: No authentication mechanism implemented (to be added as needed)
3. **Data Validation**: Client-side validation with server-side validation expected
4. **Error Handling**: Basic error handling with user-friendly messages
5. **Responsive Design**: Designed for desktop and tablet use primarily
6. **Browser Compatibility**: Modern browsers with ES2017+ support
7. **Internet Connection**: Assumes stable internet connection for API calls
8. **CORS**: Backend should have CORS configured for frontend domain

## Troubleshooting

### Common Issues

1. **Node.js Version Issues**
   ```bash
   # Check Node.js version
   node --version
   # Should be 18.19.0 or later
   ```

2. **Angular CLI Issues**
   ```bash
   # Reinstall Angular CLI
   npm uninstall -g @angular/cli
   npm install -g @angular/cli@20.1.0
   ```

3. **Dependency Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port Already in Use**
   ```bash
   # Use different port
   ng serve --port 4201
   ```

5. **API Connection Issues**
   - Verify backend server is running
   - Check API URL in environment files
   - Ensure CORS is configured on backend

### Development Tools

#### Recommended VS Code Extensions
- Angular Language Service
- Angular Snippets
- TypeScript Hero
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

#### Debugging
- Use Angular DevTools browser extension
- Enable source maps for debugging
- Use browser developer tools for network inspection

## Contributing

1. Follow Angular style guide
2. Use meaningful commit messages
3. Write unit tests for new features
4. Ensure code passes linting
5. Test responsive design on different screen sizes

## Deployment

### Development Deployment
```bash
ng build --configuration development
```

### Production Deployment
```bash
ng build --configuration production
```

Deploy the contents of the `dist/` folder to your web server.

### Environment Variables for CI/CD
- `API_URL` - Backend API URL
- `ENVIRONMENT` - Target environment (development/production)

## License

This project is developed for educational/assessment purposes.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
