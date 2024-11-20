import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCuentaComponent } from './config-cuenta.component';

describe('ConfigCuentaComponent', () => {
  let component: ConfigCuentaComponent;
  let fixture: ComponentFixture<ConfigCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
