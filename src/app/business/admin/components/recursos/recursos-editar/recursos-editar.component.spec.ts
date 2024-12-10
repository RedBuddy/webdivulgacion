import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosEditarComponent } from './recursos-editar.component';

describe('RecursosEditarComponent', () => {
  let component: RecursosEditarComponent;
  let fixture: ComponentFixture<RecursosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
