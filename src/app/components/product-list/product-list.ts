import { Component, OnInit } from '@angular/core';
import { ApiService, Product } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// Imports de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  allProducts: Product[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const snackBarRef = this.snackBar.open(
      'Cargando productos... Los servicios gratuitos pueden tardar un momento en iniciar.',
      'CERRAR',
      { duration: undefined }
    );

    this.apiService
      .getProducts()
      .pipe(
        // --- ESTA PARTE FALTABA ---
        // finalize() se ejecuta siempre al final, sin importar si hubo éxito o error.
        finalize(() => {
          this.isLoading = false; // Oculta el spinner
          snackBarRef.dismiss(); // Cierra el aviso
        })
      )
      .subscribe({
        next: (data) => {
          this.allProducts = data;
        },
        error: (err) => {
          console.error('Error al cargar productos', err);
          this.snackBar.open(
            'Error al cargar los productos. Intenta de nuevo más tarde.',
            'CERRAR',
            { duration: 3000 }
          );
        },
      });
  }

  // Usamos un "getter" para que la lista se filtre automáticamente
  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.allProducts;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
    );
  }
}
