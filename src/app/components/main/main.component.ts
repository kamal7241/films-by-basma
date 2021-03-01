import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { FilmsServiceService } from 'src/app/services/films-service.service';
import { IFilm } from 'src/app/viewmodels/ifilm';
import { DomSanitizer } from '@angular/platform-browser';
import { take, map, filter } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnChanges {
  imgs: any = [];
  ChannelID: number = 2;
  filmList: IFilm[] = [];

  constructor(
    private filmService: FilmsServiceService,
    private _sanitizationService: DomSanitizer
  ) {
    this.imgs = [
      { path: '../../../assets/carousel1.jpg' },
      { path: '../../../assets/carousel2.jpg' },
      { path: '../../../assets/carousel3.jpg' },
      { path: '../../../assets/carousel4.jpg' },
    ];
  }
  ngOnChanges(): void {}

  ngOnInit(): void {
    this.filmService.getFilmsbyChannelID(this.ChannelID).subscribe(
      (res) => {
        console.log('here' + res);
        this.filmList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  refresh() {
    this.filmService.refresh.subscribe(() => {
      console.log('refresh');
      this.filmService.getFilmsbyChannelID(this.ChannelID).subscribe(
        (res) => {
          console.log('here from refresh' + res);
          this.filmList = res;
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  addComment(id: string, comment: string) {
    console.log(this.filmList);
    this.filmService.addComment(parseInt(id), comment);
  }
  search(id: string) {
    this.filmService.getFilmsbyChannelID(parseInt(id)).subscribe(
      (res) => {
        console.log('here' + res);
        this.filmList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSafeURL(filmurl: string) {
    // var promise = new Promise((res, rej) => {
    // });
    // Promise.resolve('shown')
    //   .then(() => {
    //     return this._sanitizationService.bypassSecurityTrustResourceUrl(
    //       filmurl
    //     );
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    try {
      return this._sanitizationService.bypassSecurityTrustResourceUrl(filmurl);
    } catch (e) {
      console.log("can't get vedios " + e);
      return null;
    }
  }

  drop(event: CdkDragDrop<IFilm[]>) {
    moveItemInArray(this.filmList, event.previousIndex, event.currentIndex);
  }
}
