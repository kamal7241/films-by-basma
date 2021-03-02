import { Injectable } from '@angular/core';
import { IFilm } from '../viewmodels/ifilm';
// import { HttpModule } from '@angular/http';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, Subject, range } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from 'reactive-state';

import { take, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilmsServiceService {
  // filmsOfChannel: Observable<IFilm[]> | null = null;
  private sub = new Subject<void>();
  constructor(private http: HttpClient) {}
  get refresh() {
    return this.sub;
  }
  getFilmsbyChannelID(id: number): Observable<IFilm[]> {
    return this.http.get<IFilm[]>(`http://localhost:3000/films?channel=${id}`);

    // return this.filmsOfChannel ? this.filmsOfChannel : null;
  }

  addComment(id: number, comment: string) {
    this.http
      .patch(`http://localhost:3000/films/${id}`, { notes: comment })
      .subscribe(
        (res) => {
          console.log('from film service patch ' + res);
        },
        (err) => {
          console.log('from film service patch error' + err);
        }
      );
  }
}
