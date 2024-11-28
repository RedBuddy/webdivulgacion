import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliSubirArticuloComponent } from './publi-subir-articulo.component';

describe('PubliSubirArticuloComponent', () => {
  let component: PubliSubirArticuloComponent;
  let fixture: ComponentFixture<PubliSubirArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliSubirArticuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliSubirArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
