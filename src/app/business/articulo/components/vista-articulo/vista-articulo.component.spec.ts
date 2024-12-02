import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaArticuloComponent } from './vista-articulo.component';

describe('VistaArticuloComponent', () => {
  let component: VistaArticuloComponent;
  let fixture: ComponentFixture<VistaArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaArticuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
