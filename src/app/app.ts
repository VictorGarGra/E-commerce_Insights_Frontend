import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/dashboard/footer/footer';
import { Header } from './components/dashboard/header/header';
import { MatIconModule } from '@angular/material/icon'; // <-- ¡Importa esto!

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, MatIconModule], // <-- Añádelo aquí
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('insights-frontend');
}
