import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService, Review, Product, Sentiment } from '../../services/api';
import { CommonModule } from '@angular/common';

// Módulos para la vista y formularios
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxChartsModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  // Propiedades para datos y UI
  chartData: any[] = [];
  reviews: Review[] = [];
  product: Product | null = null;
  reviewForm: FormGroup;

  // Propiedades para las gráficas
  showLegend: boolean = true;
  gradient: boolean = false;
  customColors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      userComment: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const id = +productId;

      this.apiService.getProductById(id).subscribe((productData) => {
        this.product = productData;
      });

      this.apiService.getReviewsByProduct(id).subscribe((reviews) => {
        this.reviews = reviews;
        this.updateCharts(); // Llama a la función que actualiza todo
      });
    }
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      return;
    }

    const newReviewData = {
      product: this.product,
      userComment: this.reviewForm.value.userComment,
      rating: this.reviewForm.value.rating,
    };

    this.apiService.addReview(newReviewData).subscribe((savedReview) => {
      this.reviews.push(savedReview);
      this.updateCharts(); // Llama a la función que actualiza todo
      this.reviewForm.reset();
    });
  }

  // MÉTODO CENTRALIZADO PARA ACTUALIZAR GRÁFICAS Y COLORES
  private updateCharts(): void {
    this.processReviewsForChart(this.reviews);
    this.assignCustomColors();
  }

  private processReviewsForChart(reviews: Review[]): void {
    const sentimentCounts: { [key in Sentiment]: number } = {
      POSITIVO: 0,
      NEGATIVO: 0,
      NEUTRAL: 0,
    };

    reviews.forEach((review) => {
      const sentiment = review.sentiment as Sentiment;
      if (sentimentCounts.hasOwnProperty(sentiment)) {
        sentimentCounts[sentiment]++;
      }
    });

    this.chartData = Object.keys(sentimentCounts).map((key) => ({
      name: key,
      value: sentimentCounts[key as Sentiment],
    }));
  }

  // MÉTODO 'assignCustomColors' AÑADIDO
  assignCustomColors(): void {
    this.customColors = this.chartData.map((item) => {
      let color = '#9e9e9e'; // Gris (NEUTRAL)
      if (item.name === 'POSITIVO') {
        color = '#4caf50'; // Verde
      } else if (item.name === 'NEGATIVO') {
        color = '#f44336'; // Rojo
      }
      return { name: item.name, value: color };
    });
  }

  getSentimentClass(sentiment: string): string {
    if (sentiment === 'POSITIVO') return 'sentiment-positive';
    if (sentiment === 'NEGATIVO') return 'sentiment-negative';
    return 'sentiment-neutral';
  }
}
