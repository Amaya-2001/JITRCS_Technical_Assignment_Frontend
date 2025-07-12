import { Routes } from '@angular/router';
import { InvoiceGeneratorComponent } from './components/invoice-generator/invoice-generator.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/generate-invoice', pathMatch: 'full' },
    { path: 'generate-invoice', component: InvoiceGeneratorComponent },
    { path: 'invoice-list', component: InvoiceListComponent },
    { path: '**', redirectTo: '/generate-invoice' }
];
