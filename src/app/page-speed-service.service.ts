import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {parseHttpResponse} from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PageSpeedServiceService {
  apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  dbUrl = 'https://releases-9ff4d.firebaseio.com/pagespeed/';

  constructor(private http: HttpClient) { }

  /**
   * This function launch a get petition to performance api and save the info.
   * @param url Page url to check
   * @param device String This parameter indicate in wich device we want to check. We can use 'desktop' or 'mobile'.
   */
  checkPagePerformance(url: string, device: string): void {
   const propertyName = 'lighthouseResult';
   this.http.get(this.apiUrl + '?url=' + url + '&strategy=' + device)
     .subscribe( data => { this.saveData('destination', data); });
  }

  /**
   * This function save the results in data base.
   * @param pageType String. This parameter set the page type where we will save the info.
   * @param data Object. This parameter is the info that we want to save in data base.
   */
  saveData(pageType, data): void {
    const propertyName = 'loadingExperience';
    const propertyName2 = 'lighthouseResult';
    const date = new Date();
    const key = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const d = {
      loadingExperience: data[propertyName],
      lighthouseResult: data[propertyName2].categories.performance,
      timing: data[propertyName2].timing
    };
    this.http.put( this.dbUrl + '/' + pageType + '/' + key + '/.json', d, httpOptions)
      .subscribe(response => console.log(response));
  }

  /**
   * This function obtains the performance results saved in data base.
   * @param pageType String. This parameter select the page type wich we will obtain the info.
   */
  getPSdata(pageType: string) {
    return this.http.get(this.dbUrl + pageType + '/.json');
  }
}
