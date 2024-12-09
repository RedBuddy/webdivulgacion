import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaSubirComponent } from './pregunta-subir.component';

describe('PreguntaSubirComponent', () => {
  let component: PreguntaSubirComponent;
  let fixture: ComponentFixture<PreguntaSubirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaSubirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaSubirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
