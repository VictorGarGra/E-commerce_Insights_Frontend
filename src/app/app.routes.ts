import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { Dashboard } from './components/dashboard/dashboard';
import { ProductCreate } from './components/product-create/product-create';

export const routes: Routes = [
  // Si la URL está vacía, redirige a /products
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  // Cuando la URL sea /products, muestra el componente ProductListComponent
  { path: 'products', component: ProductList },
  // Cuando la URL sea /dashboard/1 (o cualquier número), muestra el DashboardComponent
  { path: 'dashboard/:id', component: Dashboard },
  { path: 'create-product', component: ProductCreate },
];
