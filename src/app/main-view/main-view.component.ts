import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-view',
  imports: [MatIconModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent {
  title: string = 'null';

  constructor() {}
  
   @Input() portfolio: any;

 
}
