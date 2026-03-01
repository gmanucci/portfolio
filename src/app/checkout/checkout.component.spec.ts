import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let httpMock: HttpTestingController;

  const mockItems = [
    { id: 1, name: 'Cerveja', category: 'Bebidas', price: 18.90 },
    { id: 2, name: 'Refrigerante', category: 'Bebidas', price: 7.00 },
    { id: 3, name: 'Fritas', category: 'Petiscos', price: 28.00 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne('menu-items.json');
    req.flush(mockItems);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load menu items', () => {
    expect(component.items.length).toBe(3);
  });

  it('should default people count to 1', () => {
    expect(component.peopleCount).toBe(1);
  });

  it('should return 0 total when nothing is selected', () => {
    expect(component.total).toBe(0);
  });

  it('should compute total of selected items', () => {
    component.items[0].selected = true; // 18.90
    component.items[2].selected = true; // 28.00
    expect(component.total).toBeCloseTo(46.90, 2);
  });

  it('should compute per-person amount correctly', () => {
    component.items[0].selected = true; // 18.90
    component.peopleCount = 3;
    expect(component.perPersonAmount).toBeCloseTo(6.30, 2);
  });

  it('should list unique categories', () => {
    expect(component.categories).toEqual(['Bebidas', 'Petiscos']);
  });

  it('should select all items with toggleAll(true)', () => {
    component.toggleAll(true);
    expect(component.allSelected).toBeTrue();
  });

  it('should deselect all items with toggleAll(false)', () => {
    component.toggleAll(true);
    component.toggleAll(false);
    expect(component.allSelected).toBeFalse();
    expect(component.total).toBe(0);
  });

  it('should reflect quantity in total', () => {
    component.items[0].selected = true;
    component.items[0].quantity = 2;
    expect(component.total).toBeCloseTo(37.80, 2);
  });

  it('should clear bills when item selection changes', () => {
    component.bills = [{ personIndex: 1, amount: 10, pixCode: 'X', qrDataUrl: '' }];
    component.onItemChange();
    expect(component.bills.length).toBe(0);
  });
});
