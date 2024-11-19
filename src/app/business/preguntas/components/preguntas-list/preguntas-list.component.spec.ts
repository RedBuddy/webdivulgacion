import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasListComponent } from './preguntas-list.component';

describe('PreguntasListComponent', () => {
  let component: PreguntasListComponent;
  let fixture: ComponentFixture<PreguntasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
