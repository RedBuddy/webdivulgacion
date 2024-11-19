import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaHeaderComponent } from './pregunta-header.component';

describe('PreguntaHeaderComponent', () => {
  let component: PreguntaHeaderComponent;
  let fixture: ComponentFixture<PreguntaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
