import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MainViewComponent } from "./main-view/main-view.component";
import { HttpClient } from '@angular/common/http';
import { JobTimelineComponent } from "./job-timeline/job-timeline.component";
import { SkillsContainerComponent } from "./skills-container/skills-container.component";
import { JobDetailsComponent } from "./job-details/job-details.component";
import { SvgCustomIconsModule } from './svg-custom-icons/svg-custom-icons.module';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SocialBarComponent } from './social-bar/social-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MainViewComponent, 
    JobTimelineComponent, 
    SkillsContainerComponent, 
    JobDetailsComponent,
    SocialBarComponent,
    SvgCustomIconsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  portfolioInfo: any;
  title = 'portfolio';

  constructor(private http: HttpClient, public router: Router) {}

  get isCheckout(): boolean {
    return this.router.url.startsWith('/checkout');
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
