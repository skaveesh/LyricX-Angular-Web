import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  MAT_SNACK_BAR_DATA,
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatProgressBarModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSnackBarRef,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
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
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './components/contribute/login/login.component';
import {ContributorDashboardComponent} from './components/contribute/contributor-dashboard/contributor-dashboard.component';
import {MyProfileTabComponent} from './components/contribute/contributor-dashboard/my-profile-tab/my-profile-tab.component';
import {DefaultSnackBarComponent} from './components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ContributeTabComponent} from './components/contribute/contributor-dashboard/contribute-tab/contribute-tab.component';
import {AlbumAndAuthorAddingDashboardComponent} from './components/contribute/contributor-dashboard/contribute-tab/album-and-author-adding-dashboard/album-and-author-adding-dashboard.component';
import {AddArtistComponent} from './components/contribute/contributor-dashboard/contribute-tab/add-artist/add-artist.component';
import {AddAlbumComponent} from './components/contribute/contributor-dashboard/contribute-tab/add-album/add-album.component';
import {Constants} from './constants/constants';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([Constants.Route.LOGIN]);
const redirectLoggedInToContribute = () => redirectLoggedInTo([Constants.Route.CONTRIBUTE]);

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
    ContributeTabComponent,
    AlbumAndAuthorAddingDashboardComponent,
    AddArtistComponent,
    AddAlbumComponent
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
    MatRippleModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RouterModule.forRoot([
      {
        path: Constants.Route.HOME,
        component: HomeComponent
      },
      {
        path: Constants.Route.LYRICS_VIEW,
        component: LyricsviewComponent
      },
      {
        path: Constants.Route.TOP_LYRICS,
        component: TopLyricsComponent
      },
      {
        path: Constants.Route.CONTRIBUTE,
        component: ContributeComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: Constants.Route.LOGIN,
        component: LoginComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToContribute }
      },
      {
        path: Constants.Route.ADD_ARTIST,
        component: AddArtistComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: Constants.Route.ADD_ALBUM,
        component: AddAlbumComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: Constants.Route.ABOUT,
        component: AboutComponent
      },
      {
        path: Constants.Route.WILDCARD,
        component: NotFoundComponent
      }
    ])
  ],
  providers: [
    DefaultSnackBarComponent,
    AngularFireAuthGuard,
    {
      provide: MatSnackBarRef,
      useValue: {}
    },
    {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    }],
  entryComponents: [DefaultSnackBarComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
