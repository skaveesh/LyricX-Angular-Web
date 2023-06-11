import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import 'rxjs/operators';
import {LoadingStatusService} from './services/loading-status.service';
import {LoginAccessoryService} from './services/auth/login-accessory.service';
import {RestTemplate} from './services/rest/rest-template-builder';
import {MetadataService} from './services/rest/metadata.service';
import {ContributorAdapterService} from './services/rest/contributor-adapter.service';
import {FormControl} from '@angular/forms';
import {distinctUntilChanged, filter, tap} from 'rxjs/operators';
import {Constants} from './constants/constants';
import {Router} from '@angular/router';

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
export class AppComponent implements OnInit, AfterViewInit {

  title = 'LyricX';
  public collapse = 'closed';
  public innerWidth: any;
  progressBarViewStatus = false;
  searchQuery = new FormControl('');
  searchIconColorChange = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

// Even if these parameters not used in this AppComponent, they work on their own. Needed to initiated this way to bind with the application
  constructor(private loadingStatus: LoadingStatusService, private renderer: Renderer2, private element: ElementRef, private router: Router,
              private loginAccessory: LoginAccessoryService, private restTemplate: RestTemplate, private metadata: MetadataService, private cdr: ChangeDetectorRef, private contributorAdapterService: ContributorAdapterService) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.searchQuery.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((value) => {
          this.searchIconColorChange = value.length > 2;
        }))
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.loadingStatus.getLoading().subscribe(
      (status) => {

        if (status !== this.progressBarViewStatus) {
          this.progressBarViewStatus = status;
        }
      }
    );

  }

  toggleCollapse() {
    this.collapse = this.collapse === 'open' ? 'closed' : 'open';
  }

  onSearchQuery($event) {
    this.router.navigateByUrl(Constants.Route.SEARCH + Constants.Symbol.QUESTION_MARK + 'query' + Constants.Symbol.EQUAL + this.searchQuery.value);
  }

}
