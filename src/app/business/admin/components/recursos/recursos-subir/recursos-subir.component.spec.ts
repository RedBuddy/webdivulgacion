import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosSubirComponent } from './recursos-subir.component';

describe('RecursosSubirComponent', () => {
  let component: RecursosSubirComponent;
  let fixture: ComponentFixture<RecursosSubirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosSubirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosSubirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
