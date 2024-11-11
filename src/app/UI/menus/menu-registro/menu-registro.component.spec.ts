import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRegistroComponent } from './menu-registro.component';

describe('MenuRegistroComponent', () => {
  let component: MenuRegistroComponent;
  let fixture: ComponentFixture<MenuRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
