import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import 'rxjs/operators';
import {LoadingStatusService} from './services/loadingstatus.service';

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
  public progressBarViewStatus: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(private loadingStatus: LoadingStatusService, private renderer: Renderer2, private element: ElementRef) {

    this.loadingStatus.getLoading().subscribe(
      (status) => {
        this.progressBarViewStatus = status;

        let allInputElements = this.element.nativeElement.querySelectorAll('button, input, textarea');

        if (status) {
          allInputElements.forEach((element) => {
            element.disabled = true;
          });
        } else {
          allInputElements.forEach((element) => {
            element.disabled = false;
          });
        }
      }
    );

  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }


  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
  }


}
