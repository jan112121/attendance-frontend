import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyRule } from './penalty-rule';

describe('PenaltyRule', () => {
  let component: PenaltyRule;
  let fixture: ComponentFixture<PenaltyRule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyRule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyRule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
