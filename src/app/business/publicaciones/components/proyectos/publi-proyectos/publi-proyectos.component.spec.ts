import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliProyectosComponent } from './publi-proyectos.component';

describe('PubliProyectosComponent', () => {
  let component: PubliProyectosComponent;
  let fixture: ComponentFixture<PubliProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
