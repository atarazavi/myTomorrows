import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkeletonLoaderComponent } from './skeleton-loader.component';
import { ComponentPage } from '#shared/test/component-page';
import { UnitTestingModule } from '#shared/test/unit-testing.module';

class SkeletonLoaderComponentPage extends ComponentPage<SkeletonLoaderComponent> {
  rows() {
    return this.querySelectorAll<HTMLDivElement>('.loader');
  }
}

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;
  const lines = 5;

  let page: SkeletonLoaderComponentPage;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonLoaderComponent],
      imports: [
        UnitTestingModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    page = new SkeletonLoaderComponentPage(fixture);
    component.lineCount = lines;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display lines', () => {
    expect(page.rows().length).toBe(lines);
  });
});
