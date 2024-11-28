import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliHeaderComponent } from './publi-header.component';

describe('PubliHeaderComponent', () => {
  let component: PubliHeaderComponent;
  let fixture: ComponentFixture<PubliHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubliHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
