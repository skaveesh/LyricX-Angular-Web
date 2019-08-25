import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTabsModule,
  MatStepperModule,
  MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA, MatChipsModule,
  MatAutocompleteModule
} from '@angular/material';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {TopLyricsComponent} from './components/top-lyrics/top-lyrics.component';
import {ContributeComponent} from './components/contribute/contribute.component';
import {LyricsviewComponent} from './components/lyricsview/lyricsview.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AboutComponent} from './components/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './components/contribute/login/login.component';
import {ContributorDashboardComponent} from './components/contribute/contributor-dashboard/contributor-dashboard.component';
import {MyProfileTabComponent} from './components/contribute/contributor-dashboard/my-profile-tab/my-profile-tab.component';
import {DefaultSnackBarComponent} from './components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ContributeTabComponent} from './components/contribute/contributor-dashboard/contribute-tab/contribute-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopLyricsComponent,
    ContributeComponent,
    LyricsviewComponent,
    NotFoundComponent,
    AboutComponent,
    LoginComponent,
    ContributorDashboardComponent,
    MyProfileTabComponent,
    DefaultSnackBarComponent,
    ContributeTabComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'feedItem/:artist/:song',
        component: LyricsviewComponent
      },
      {
        path: 'toplyrics',
        component: TopLyricsComponent
      },
      {
        path: 'contribute',
        component: ContributeComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ])
  ],
  providers: [DefaultSnackBarComponent,
    {
      provide: MatSnackBarRef,
      useValue: {}
    }, {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    }],
  entryComponents: [DefaultSnackBarComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
