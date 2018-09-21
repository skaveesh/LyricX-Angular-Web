import {Component, HostListener, OnInit} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        // transform: 'translate3d(0, 0, 0)'
      })),
      state('closed', style({
        opacity: '0',
        display: 'none',
        // transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('2000ms ease-in')),
      transition('open => closed', animate('1000ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'LyricX';
  public collapse = 'closed';
  public innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
  }
}
