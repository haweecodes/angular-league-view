import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {
  configUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json'
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const headers =  {
      headers: new  HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded'})
    };
    return this.http.get(this.configUrl, headers);
  }
}
