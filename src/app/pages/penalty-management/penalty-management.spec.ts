import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyManagement } from './penalty-management';

describe('PenaltyManagement', () => {
  let component: PenaltyManagement;
  let fixture: ComponentFixture<PenaltyManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
