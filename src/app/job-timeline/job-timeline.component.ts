import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-timeline',
  imports: [CommonModule],
  templateUrl: './job-timeline.component.html',
  styleUrl: './job-timeline.component.scss'
})
export class JobTimelineComponent {
   timeline: { title: string; company: string; left: string }[] = [];

  private _jobs: any[] = [];

  @Input() set jobs(value: any[]) {
    this._jobs = value || [];
    this.buildTimeline();
  }

  get jobs(): any[] {
    return this._jobs;
  }

  private buildTimeline(): void {
    if (!this.jobs || this.jobs.length === 0) {
      this.timeline = [];
      return;
    }

    const parseDate = (d: string) => new Date(d === 'Present' ? new Date().toISOString() : d).getTime();
    const minDate = Math.min(...this.jobs.map(j => parseDate(j.startDate)));
    const maxDate = Math.max(...this.jobs.map(j => parseDate(j.endDate)));

    this.timeline = this.jobs.map(job => {
      const endTime = parseDate(job.endDate);
      const left = ((endTime - minDate) / (maxDate - minDate)) * 100;
      return {
        title: job.title,
        company: job.company,
        left: `${left}%`
      };
    });
  }
}
