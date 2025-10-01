import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
