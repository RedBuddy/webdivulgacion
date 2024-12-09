import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoMensajeComponent } from './contacto-mensaje.component';

describe('ContactoMensajeComponent', () => {
  let component: ContactoMensajeComponent;
  let fixture: ComponentFixture<ContactoMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoMensajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
