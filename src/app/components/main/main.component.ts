import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { FilmsServiceService } from 'src/app/services/films-service.service';
import { IFilm } from 'src/app/viewmodels/ifilm';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
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
  ChannelID: number = 1;
  filmList: IFilm[] = [];
  filmurl: SafeResourceUrl | any;

  constructor(
    private filmService: FilmsServiceService,
    private _sanitizationService: DomSanitizer
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getSafeurl();
  }

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
    this.getSafeurl();
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
  getSafeurl() {
    this.filmService.getFilmsbyChannelID(this.ChannelID).subscribe((res) => {
      res.map(
        (item) =>
          (this.filmurl = this._sanitizationService.bypassSecurityTrustResourceUrl(
            item.embed
          ))
      );
      // res.forEach((i) => {
      //   this.filmurl = this._sanitizationService.bypassSecurityTrustResourceUrl(
      //     i.embed
      //   );
      //   this.filmurl = this.filmurl.toString();

      //   console.log('k ' + this.filmurl);
      // });
    });
  }

  drop(event: CdkDragDrop<IFilm[]>) {
    moveItemInArray(this.filmList, event.previousIndex, event.currentIndex);
  }
}
