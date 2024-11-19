import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadoresListComponent } from './investigadores-list.component';

describe('InvestigadoresListComponent', () => {
  let component: InvestigadoresListComponent;
  let fixture: ComponentFixture<InvestigadoresListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigadoresListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigadoresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
