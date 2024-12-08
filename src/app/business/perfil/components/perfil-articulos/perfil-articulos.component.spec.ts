import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilArticulosComponent } from './perfil-articulos.component';

describe('PerfilArticulosComponent', () => {
  let component: PerfilArticulosComponent;
  let fixture: ComponentFixture<PerfilArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilArticulosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
