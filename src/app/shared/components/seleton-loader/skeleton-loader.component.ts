import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() lineCount = 1;
  items: Array<number> = [];

  ngOnInit() {
    if (this.lineCount > 0) {
      this.items.length = this.lineCount - 1;
    }
  }

}
