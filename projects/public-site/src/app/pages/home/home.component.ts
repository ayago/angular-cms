import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div [innerHTML]="pageData?.content"></div>
  `,
  standalone: true
})
export class HomeComponent implements OnInit {
  pageData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log('[HOME] Route data:', data['pageData']);
      if (data['pageData']) {
        this.pageData = data['pageData'];
      }
    });
  }
}
