import { Injectable } from '@angular/core';

export interface PixConfig {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txid?: string;
}

@Injectable({ providedIn: 'root' })
export class PixService {

  /**
   * Generates a PIX payload string (EMV/QR code format) following the
   * Banco Central do Brasil specification.
   */
  generatePayload(config: PixConfig, amount: number): string {
    const amountStr = amount.toFixed(2);
    const name = this.sanitize(config.merchantName, 25);
    const city = this.sanitize(config.merchantCity, 15);
    const txid = this.sanitize(config.txid ?? '***', 25);

    const gui = this.field('00', 'BR.GOV.BCB.PIX');
    const key = this.field('01', config.pixKey);
    const merchantAccount = this.field('26', gui + key);

    const payload =
      this.field('00', '01') +          // Payload Format Indicator
      this.field('01', '12') +          // Point of Initiation (12 = reusable)
      merchantAccount +                  // Merchant Account Information
      this.field('52', '0000') +         // Merchant Category Code
      this.field('53', '986') +          // Currency (BRL)
      this.field('54', amountStr) +      // Transaction Amount
      this.field('58', 'BR') +           // Country Code
      this.field('59', name) +           // Merchant Name
      this.field('60', city) +           // Merchant City
      this.field('62', this.field('05', txid)) + // Additional Data
      '6304';                            // CRC placeholder

    return payload + this.crc16(payload);
  }

  // ---------- private helpers ----------

  private field(id: string, value: string): string {
    return id + value.length.toString().padStart(2, '0') + value;
  }

  private sanitize(value: string, maxLen: number): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
      .replace(/[^A-Za-z0-9 ]/g, '')     // only alphanumeric + space
      .substring(0, maxLen)
      .trim();
  }

  /** CRC-16/CCITT-FALSE (polynomial 0x1021, init 0xFFFF) */
  private crc16(payload: string): string {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      }
      crc &= 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
}
