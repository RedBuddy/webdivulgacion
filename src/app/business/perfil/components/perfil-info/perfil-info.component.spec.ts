import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilInfoComponent } from './perfil-info.component';

describe('PerfilInfoComponent', () => {
  let component: PerfilInfoComponent;
  let fixture: ComponentFixture<PerfilInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
