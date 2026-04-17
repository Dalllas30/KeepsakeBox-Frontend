import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormObject, FoundImage } from '../models/image.model';


@Injectable({
  providedIn: 'root',
})
export class OnlineSearchService {
  //private photoUrl = 'http://194.117.20.219:8081/api';
  private photoUrl = 'localhost:8081/api';
  private headers : HttpHeaders = new HttpHeaders().set("content-type", "application/json").set('Access-Control-Allow-Origin', '*');;

  constructor(
    private http: HttpClient,
  ) { }
  
  checkPhotos() : boolean {
    if (localStorage.getItem("photos")) {
      return true;
    }
    else {
      return false;
    }
  }

  checkPhotos2() : boolean {
    if(localStorage.getItem('photos2')) {
      return true;
    }
    else{
      return false;
    }
  }

  getAccepted() : Observable<FoundImage[]> {
    var ps : FoundImage[] = [];
    if (localStorage.getItem('va1')) {
      ps = JSON.parse(localStorage.getItem("va1")!);
      return of(ps)
    }
    else {
      JSON.parse(localStorage.getItem("photos")!).forEach((photo: FoundImage) => {
        if (photo.acceptance) {
          ps.push(photo);
        }
      });
      return of(ps);
    }
  }

  getRejected() : Observable<FoundImage[]> {
    var ps : FoundImage[] = [];
    if (localStorage.getItem('vr1')) {
      ps = JSON.parse(localStorage.getItem("vr1")!);
      return of(ps)
    }
    else {
      JSON.parse(localStorage.getItem("photos")!).forEach((photo: FoundImage) => {
        if (!photo.acceptance) {
          ps.push(photo);
        }
      });
      return of(ps);
    }
  }

  getAccepted2() : Observable<FoundImage[]> {
    var ps : FoundImage[] = [];
    if (localStorage.getItem('va2')) {
      ps = JSON.parse(localStorage.getItem("va2")!);
      return of(ps)
    }
    else {
      JSON.parse(localStorage.getItem("photos2")!).forEach((photo: FoundImage) => {
        if (photo.acceptance) {
          ps.push(photo);
        }
      });
      return of(ps);
    }
  }

  getRejected2() : Observable<FoundImage[]> {
    var ps : FoundImage[] = [];
    if (localStorage.getItem('vr2')) {
      ps = JSON.parse(localStorage.getItem("vr2")!);
      return of(ps)
    }
    else {
      JSON.parse(localStorage.getItem('photos2')!).forEach((photo: FoundImage) => {
        if (!photo.acceptance) {
          ps.push(photo);
        }
      });
      return of(ps);
    }
  }

  setPhotos(photos : FoundImage[]) : void {
    localStorage.setItem("photos", JSON.stringify(photos));
  }

  setPhotos2() : void {
    if (localStorage.getItem('vr1')) {
      var photosA: FoundImage[] = JSON.parse(localStorage.getItem('va1')!);
      var photosR: FoundImage[] = JSON.parse(localStorage.getItem('vr1')!);
      var photos: FoundImage[] = [ ...photosA, ...photosR];
      localStorage.setItem('photos2', JSON.stringify(photos));
      localStorage.removeItem('photos');
    }
    else {
      var photos: FoundImage[] = JSON.parse(localStorage.getItem('va1')!);
      localStorage.setItem('photos2', JSON.stringify(photos));
      localStorage.removeItem('photos');
    }
    
  }

  conclude() : void {
    if (localStorage.getItem('vr2')) {
      var photosA: FoundImage[] = JSON.parse(localStorage.getItem('va2')!);
      var photosR: FoundImage[] = JSON.parse(localStorage.getItem('vr2')!);
      var photos: FoundImage[] = [ ...photosA, ...photosR];
      var photosToSend: FoundImage[] = photos.filter(photo => photo.acceptance == true);
      this.postPhotos(photosToSend);
      localStorage.clear();
    }
    else {
      var photos: FoundImage[] = JSON.parse(localStorage.getItem('va2')!);
      var photosToSend: FoundImage[] = photos.filter(photo => photo.acceptance == true);
      this.postPhotos(photosToSend);
      localStorage.clear();
    }
  }




  getPhotos(formObject: FormObject): Observable<FoundImage[]> {
    if (formObject.per_page == null) formObject.per_page = 100;
    if (formObject.page == null)     formObject.page = 1;

    const params = new HttpParams()
      .set('tags',     formObject.tags)
      .set('tag_mode', formObject.tag_mode)
      .set('text',     formObject.text)
      .set('sort',     formObject.sort.toString())
      .set('per_page', formObject.per_page.toString())
      .set('page',     formObject.page.toString());

    return this.http.get<FoundImage[]>(this.photoUrl + '/photos', { headers: this.headers, params });
  }

  postPhotos(photos: FoundImage[]) : void {
    this.http.post<FoundImage[]>( this.photoUrl + '/photos/post', photos, { headers: this.headers }).subscribe(
      res => {
        console.log("photos sent");
      }
    );
  }
}
