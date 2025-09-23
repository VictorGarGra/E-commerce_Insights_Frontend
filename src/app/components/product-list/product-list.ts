import { Component, OnInit } from '@angular/core';
import { ApiService, Product } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Te faltaba importar el módulo del botón

@Component({
  selector: 'product-list',
  standalone: true, // <-- AÑADIDO: Es importante para componentes modernos
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, // <-- Añadido al array de imports
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  allProducts: Product[] = []; // Lista maestra con todos los productos
  filteredProducts: Product[] = []; // Lista que se muestra en la pantalla
  searchTerm: string = ''; // Término de búsqueda

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data) => {
      // CORRECCIÓN: Llenamos ambas listas al recibir los datos
      this.allProducts = data;
      this.filteredProducts = data;
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    // CORRECCIÓN: Siempre filtramos desde la lista maestra 'allProducts'
    this.filteredProducts = this.allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
    );
  }
}
