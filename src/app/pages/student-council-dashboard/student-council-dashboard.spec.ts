import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCouncilDashboard } from './student-council-dashboard';

describe('StudentCouncilDashboard', () => {
  let component: StudentCouncilDashboard;
  let fixture: ComponentFixture<StudentCouncilDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCouncilDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCouncilDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
