import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainViewComponent } from "./main-view/main-view.component";
import { HttpClient } from '@angular/common/http';
import { JobTimelineComponent } from "./job-timeline/job-timeline.component";
import { SkillsContainerComponent } from "./skills-container/skills-container.component";
import { JobDetailsComponent } from "./job-details/job-details.component";
import { SvgCustomIconsModule } from './svg-custom-icons/svg-custom-icons.module';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MainViewComponent, 
    JobTimelineComponent, 
    SkillsContainerComponent, 
    JobDetailsComponent,
    SvgCustomIconsModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  portfolioInfo: any;
  title = 'portfolio';

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.http.get('portfolio-info.json').subscribe({
      next: (data: any) => {
        console.log('Portfolio data loaded:', data);
        this.portfolioInfo = data;
        this.title = data.title;
      },
      error: (err) => {
        console.error('Error loading portfolio data:', err);
      }
    });
  }
}
