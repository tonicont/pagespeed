import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSpeedResultsComponent } from './page-speed-results.component';

describe('PageSpeedResultsComponent', () => {
  let component: PageSpeedResultsComponent;
  let fixture: ComponentFixture<PageSpeedResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSpeedResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSpeedResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
