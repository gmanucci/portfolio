import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTimelineComponent } from './job-timeline.component';

describe('JobTimelineComponent', () => {
  let component: JobTimelineComponent;
  let fixture: ComponentFixture<JobTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
