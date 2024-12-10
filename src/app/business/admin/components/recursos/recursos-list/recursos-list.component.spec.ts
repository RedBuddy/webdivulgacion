import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosListComponent } from './recursos-list.component';

describe('RecursosListComponent', () => {
  let component: RecursosListComponent;
  let fixture: ComponentFixture<RecursosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
