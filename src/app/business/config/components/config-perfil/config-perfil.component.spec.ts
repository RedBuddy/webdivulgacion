import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPerfilComponent } from './config-perfil.component';

describe('ConfigPerfilComponent', () => {
  let component: ConfigPerfilComponent;
  let fixture: ComponentFixture<ConfigPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
