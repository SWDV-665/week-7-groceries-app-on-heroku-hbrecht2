import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroceriesServiceService {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangedSubject: Subject<boolean>;

  baseURL = "https://groceries-server-hbrecht2.herokuapp.com";

constructor(public http:HttpClient) { 
  this.dataChangedSubject = new Subject<boolean>();
  this.dataChanged$ = this.dataChangedSubject.asObservable();
}

getItems(): Observable<object[]> {
  return this.http.get(this.baseURL + '/api/groceries').pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}

private extractData(res: Response) {
  let body = res;
  return (body || {}) as object[];
  }

private handleError(error: Response | any) {
  let errMsg: string;
  if (error instanceof Response) {
    const err = error || '';
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  }else{
    errMsg = error.message ? error.message : error.toString();
  }
  console.error(errMsg);
  return Observable.throw(errMsg);
}

removeItem(id){
  console.log("Removing item - id = ", id);
  this.http.delete(this.baseURL + '/api/groceries/' + id).subscribe(res => {
    this.items = res;
    this.dataChangedSubject.next(true);
  });
}

addItem(item){
  console.log("Adding", item);
  this.http.post(this.baseURL + '/api/groceries/', item).subscribe(res => {
    this.items = res;
    this.dataChangedSubject.next(true);
  });
}

editItem(item, id, index){
  console.log("Editing item= ", item);
  this.http.put(this.baseURL + '/api/groceries/' + id, item).subscribe(res => {
    this.items = res;
    this.dataChangedSubject.next(true);
  });
}

}
