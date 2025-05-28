import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsContainerComponent } from './skills-container.component';

describe('SkillsContainerComponent', () => {
  let component: SkillsContainerComponent;
  let fixture: ComponentFixture<SkillsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
