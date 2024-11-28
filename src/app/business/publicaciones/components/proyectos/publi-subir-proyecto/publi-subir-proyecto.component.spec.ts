import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliSubirProyectoComponent } from './publi-subir-proyecto.component';

describe('PubliSubirProyectoComponent', () => {
  let component: PubliSubirProyectoComponent;
  let fixture: ComponentFixture<PubliSubirProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliSubirProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliSubirProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
