import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliArticulosComponent } from './publi-articulos.component';

describe('PubliArticulosComponent', () => {
  let component: PubliArticulosComponent;
  let fixture: ComponentFixture<PubliArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliArticulosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
