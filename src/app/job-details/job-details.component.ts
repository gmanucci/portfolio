import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {

  private _career: any[] = [];

  @Input() set career(value: any[]) {
    this._career = value || [];
  }

  get career(): any[] {
    return this._career;
  }

  

}
