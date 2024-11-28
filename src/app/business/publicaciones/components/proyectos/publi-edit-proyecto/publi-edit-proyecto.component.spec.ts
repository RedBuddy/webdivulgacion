import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliEditProyectoComponent } from './publi-edit-proyecto.component';

describe('PubliEditProyectoComponent', () => {
  let component: PubliEditProyectoComponent;
  let fixture: ComponentFixture<PubliEditProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliEditProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliEditProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
