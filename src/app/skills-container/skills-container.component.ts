import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'

@Component({
  selector: 'app-skills-container',
  imports: [CommonModule, MatIconModule],
  templateUrl: './skills-container.component.html',
  styleUrl: './skills-container.component.scss'
})
export class SkillsContainerComponent {

  items: any[] = [];

  @Input() set skills(value: any[]) {
    this.items = value || [];
  }
}
