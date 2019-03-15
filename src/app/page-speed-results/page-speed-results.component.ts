import { Component, OnInit } from '@angular/core';
import { PageSpeedServiceService } from '../page-speed-service.service';

@Component({
  selector: 'app-page-speed-results',
  templateUrl: './page-speed-results.component.html',
  styleUrls: ['./page-speed-results.component.scss']
})
export class PageSpeedResultsComponent implements OnInit {
  urlList = {
    destinations: {
      international: '',
      country: '',
      destination: 'http://www.edreams.es/vuelos/barcelona/BCN',
      cityPairs: ''
    },
    airlines: {
      index: '',
      airline: '',
      cityPair: ''
    },
    dynpack: {
      destination: '',
      cheapFlights: '',
      lowcost: '',
      lastminute: '',
      weekends: '',
      hotels: ''
    }
  };
  data: any[];
  constructor(private pageSpeedService: PageSpeedServiceService) { }

  ngOnInit() {
    this.getPageData('destination', 'mobile');
  }
  checkPS(): void {
    this.pageSpeedService.checkPagePerformance(this.urlList.destinations.destination, 'mobile');
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
        this.data = result;
      });
  }
}
