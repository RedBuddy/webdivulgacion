import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliEditArticuloComponent } from './publi-edit-articulo.component';

describe('PubliEditArticuloComponent', () => {
  let component: PubliEditArticuloComponent;
  let fixture: ComponentFixture<PubliEditArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliEditArticuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliEditArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
