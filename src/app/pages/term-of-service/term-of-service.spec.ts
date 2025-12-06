import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermOfService } from './term-of-service';

describe('TermOfService', () => {
  let component: TermOfService;
  let fixture: ComponentFixture<TermOfService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermOfService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermOfService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
