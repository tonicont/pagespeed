import { Component, OnInit } from '@angular/core';
import { PageSpeedServiceService } from '../page-speed-service.service';

@Component({
  selector: 'app-page-speed-results',
  templateUrl: './page-speed-results.component.html',
  styleUrls: ['./page-speed-results.component.scss']
})
export class PageSpeedResultsComponent implements OnInit {

  data = [{
    international: [],
    country: [],
    destination : [],
    airline: [],
    dynpack: [],
    cityPairs: [],
    lowcost: [],
    cheapFlights: [],
    lastMinute: [],
    weekends: [],
    hotels: []
  }];
  pageTypeList = [
    'international', 'country', 'destination', 'cityPairs',
    'airline', 'dynpack', 'lowcost', 'cheapFlights', 'lastminute', 'weekends', 'hotels'
  ];
  constructor(private pageSpeedService: PageSpeedServiceService) { }

  ngOnInit() {
    this.pageTypeList.forEach((app) => this.getPageData(app, 'mobile'));
  }
  checkPS(): void {
    this.pageSpeedService.checkPagePerformance('mobile');
  }
  getPageData(pageType: string, device: string): void {
    const result = [];
    this.pageSpeedService.getPSdata(pageType, device)
      .subscribe(response => {
        Object.keys(response).forEach((currentItem) => {
          const test = {
            date: currentItem,
            data: response[currentItem]
          };
          result.push(test);
        });
        this.data[pageType] = result;
      });
  }
}
