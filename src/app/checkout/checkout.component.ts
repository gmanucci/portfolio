import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PixService } from './pix.service';
import QRCode from 'qrcode';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export interface Bill {
  personIndex: number;
  amount: number;
  pixCode: string;
  qrDataUrl: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  items: MenuItem[] = [];
  peopleCount: number = 1;
  bills: Bill[] = [];
  loading = true;

  readonly pixKey = '11999887766';
  readonly merchantName = 'Restaurante Demo';
  readonly merchantCity = 'Sao Paulo';

  constructor(
    private http: HttpClient,
    private pixService: PixService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.http.get<Omit<MenuItem, 'selected' | 'quantity'>[]>('menu-items.json').subscribe({
      next: (data) => {
        this.items = data.map((item) => ({ ...item, selected: false, quantity: 1 }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get categories(): string[] {
    return [...new Set(this.items.map((i) => i.category))];
  }

  itemsByCategory(category: string): MenuItem[] {
    return this.items.filter((i) => i.category === category);
  }

  get selectedItems(): MenuItem[] {
    return this.items.filter((i) => i.selected);
  }

  get total(): number {
    return this.selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get perPersonAmount(): number {
    const count = Math.max(1, this.peopleCount || 1);
    return this.total / count;
  }

  toggleAll(selected: boolean): void {
    this.items.forEach((i) => (i.selected = selected));
    this.bills = [];
  }

  get allSelected(): boolean {
    return this.items.length > 0 && this.items.every((i) => i.selected);
  }

  get someSelected(): boolean {
    return this.items.some((i) => i.selected) && !this.allSelected;
  }

  onItemChange(): void {
    this.bills = [];
  }

  async generateBills(): Promise<void> {
    if (this.total === 0) return;

    const count = Math.max(1, this.peopleCount || 1);
    const amount = parseFloat(this.perPersonAmount.toFixed(2));
    const newBills: Bill[] = [];

    for (let i = 0; i < count; i++) {
      const txid = `TABLE${Date.now()}P${i + 1}`;
      const pixCode = this.pixService.generatePayload(
        {
          pixKey: this.pixKey,
          merchantName: this.merchantName,
          merchantCity: this.merchantCity,
          txid,
        },
        amount
      );

      let qrDataUrl = '';
      try {
        qrDataUrl = await QRCode.toDataURL(pixCode, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 180,
        });
      } catch {
        qrDataUrl = '';
      }

      newBills.push({ personIndex: i + 1, amount, pixCode, qrDataUrl });
    }

    this.bills = newBills;
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(
      () => this.snackBar.open('Código PIX copiado!', '', { duration: 2000 }),
      () => this.snackBar.open('Não foi possível copiar. Copie o código manualmente.', 'OK', { duration: 4000 })
    );
  }
}
