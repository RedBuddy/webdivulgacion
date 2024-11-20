import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTemaComponent } from './config-tema.component';

describe('ConfigTemaComponent', () => {
  let component: ConfigTemaComponent;
  let fixture: ComponentFixture<ConfigTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
