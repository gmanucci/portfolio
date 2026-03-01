import { TestBed } from '@angular/core/testing';
import { PixService } from './pix.service';

describe('PixService', () => {
  let service: PixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a payload that starts with Payload Format Indicator 000201', () => {
    const payload = service.generatePayload(
      { pixKey: 'test@pix.com', merchantName: 'Test Merchant', merchantCity: 'Sao Paulo' },
      10.00
    );
    expect(payload.startsWith('000201')).toBeTrue();
  });

  it('should embed the PIX key in the payload', () => {
    const pixKey = 'test@pix.com';
    const payload = service.generatePayload(
      { pixKey, merchantName: 'Test', merchantCity: 'SP' },
      50.00
    );
    expect(payload).toContain(pixKey);
  });

  it('should embed the formatted amount in the payload', () => {
    const payload = service.generatePayload(
      { pixKey: 'test@pix.com', merchantName: 'Test', merchantCity: 'SP' },
      33.33
    );
    expect(payload).toContain('33.33');
  });

  it('should end with a 4-character hex CRC', () => {
    const payload = service.generatePayload(
      { pixKey: 'test@pix.com', merchantName: 'Test', merchantCity: 'SP' },
      20.00
    );
    // Last 4 chars after '6304' should be hex
    const crc = payload.slice(-4);
    expect(/^[0-9A-F]{4}$/.test(crc)).toBeTrue();
  });

  it('should include country code BR', () => {
    const payload = service.generatePayload(
      { pixKey: '12345678901', merchantName: 'Comercio', merchantCity: 'RJ' },
      100.00
    );
    expect(payload).toContain('5802BR');
  });

  it('should strip diacritics from merchant name', () => {
    const payload = service.generatePayload(
      { pixKey: 'key', merchantName: 'Café São Paulo', merchantCity: 'São Paulo' },
      5.00
    );
    // 'Café São Paulo' → 'Cafe Sao Paulo' (max 25)
    expect(payload).toContain('Cafe Sao Paulo');
  });

  it('should produce different CRCs for different amounts', () => {
    const config = { pixKey: 'key', merchantName: 'Test', merchantCity: 'SP' };
    const p1 = service.generatePayload(config, 10.00);
    const p2 = service.generatePayload(config, 20.00);
    expect(p1.slice(-4)).not.toEqual(p2.slice(-4));
  });
});
