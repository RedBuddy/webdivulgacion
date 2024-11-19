import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosHeaderComponent } from './recursos-header.component';

describe('RecursosHeaderComponent', () => {
  let component: RecursosHeaderComponent;
  let fixture: ComponentFixture<RecursosHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
