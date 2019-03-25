import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {hasOwnProperty} from 'tslint/lib/utils';

@Injectable({
  providedIn: 'root'
})
export class PageSpeedServiceService {
  apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  dbUrlTESTING = 'https://releases-9ff4d.firebaseio.com/pagespeedTESTING/';
  dbUrl = 'https://releases-9ff4d.firebaseio.com/pagespeed/';
  urlList = [{
    destinations: [{
      international: 'https://www.edreams.es/vuelos/internacionales/',
      country: 'https://www.edreams.es/vuelos/espana/ES/',
      destination: 'http://www.edreams.es/vuelos/barcelona/BCN',
      cityPairs: 'https://www.edreams.es/vuelos/malaga-barcelona/AGP/BCN/'
    }],
    airlines: [{
      index: '',
      airline: 'https://www.edreams.es/ofertas/vuelos/aerolinea/FR/ryanair/',
      routes: ''
    }],
    dynpack: [{
      dynpack: 'https://www.edreams.es/viajes/tenerife/',
      cheapFlights: '',
      lowcost: 'https://www.edreams.es/lowcost/',
      lastminute: '',
      weekends: '',
      hotels: ''
    }]
  }];

  constructor(private http: HttpClient) { }

  /**
   * This function launch a get petition to performance api and save the info.
   * @param application
   * @param page Page url to check
   * @param device String This parameter indicate in wich device we want to check. We can use 'desktop' or 'mobile'.
   */
  checkPagePerformance(device: string): void {
   this.urlList.forEach((urlList) => {
     for (const app in urlList) {
       if (urlList.hasOwnProperty(app)) {
         for (const pageType in urlList[app]) {
           if (urlList[app].hasOwnProperty(pageType)) {
             for (const url in urlList[app][pageType]) {
               if (urlList[app][pageType].hasOwnProperty(url)) {
                 if (urlList[app][pageType][url] !== '') {
                   fetch(this.apiUrl + '?url=' + urlList[app][pageType][url] + '&strategy=' + device)
                     .then(response => response.json())
                     .then(json => {
                       this.saveData(url, device, json);
                     });
                 }
               }
             }
           }
         }
       }
     }
   } );
  }

  /**
   * This function save the results in data base.
   * @param pageType String. This parameter set the page type where we will save the info.
   * @param device String.
   * @param data Object. This parameter is the info that we want to save in data base.
   */
  saveData(pageType, device, data): void {
    const propertyName = 'loadingExperience';
    const propertyName2 = 'lighthouseResult';
    const date = new Date();
    const key = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const cruxMetrics = {
      "First Contentful Paint": data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
      "First Input Delay": data.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
    };
    const lighthouse = data.lighthouseResult;
    const lighthouseMetrics = {
      'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
      'Speed Index': lighthouse.audits['speed-index'].displayValue,
      'Time To Interactive': lighthouse.audits['interactive'].displayValue,
      'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue,
      'First CPU Idle': lighthouse.audits['first-cpu-idle'].displayValue,
      'Estimated Input Latency': lighthouse.audits['estimated-input-latency'].displayValue,
      'Performance Score': lighthouse.categories['performance'].score
    };
    const d = {
      pageUrl: lighthouse.finalUrl,
      cruxMetrics,
      lighthouseMetrics
    };
    this.http.put( this.dbUrlTESTING + '/' + pageType + '/' + device + '/' + key + '/.json', d, httpOptions)
      .subscribe(response => console.log(response));
  }

  /**
   * This function obtains the performance results saved in data base.
   * @param pageType String. This parameter select the page type wich we will obtain the info.
   * @param device String.
   */
  getPSdata(pageType: string, device: string) {
    return this.http.get(this.dbUrlTESTING + pageType + '/' + device + '/.json');
  }
}
