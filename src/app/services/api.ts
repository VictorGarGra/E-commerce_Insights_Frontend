import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 1. DEFINE Y EXPORTA EL TIPO SENTIMENT AQUÍ
export type Sentiment = 'POSITIVO' | 'NEGATIVO' | 'NEUTRAL';
export type NewProduct = Omit<Product, 'id'>;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface Review {
  id: number;
  userComment: string;
  rating: number;
  // 2. USA EL TIPO SENTIMENT EN LA INTERFAZ REVIEW
  sentiment: Sentiment;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/product/${productId}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  addReview(reviewData: any): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews`, reviewData);
  }

  createProduct(productData: NewProduct): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, productData);
  }
}
