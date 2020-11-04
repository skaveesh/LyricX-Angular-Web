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
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './components/contribute/login/login.component';
import {ContributorDashboardComponent} from './components/contribute/contributor-dashboard/contributor-dashboard.component';
import {MyProfileTabComponent} from './components/contribute/contributor-dashboard/my-profile-tab/my-profile-tab.component';
import {DefaultSnackBarComponent} from './components/popups-and-modals/default-snack-bar/default-snack-bar.component';
import {ContributeTabComponent} from './components/contribute/contributor-dashboard/contribute-tab/contribute-tab.component';
import { AlbumAndAuthorAddingDashboardComponent } from './components/contribute/contributor-dashboard/contribute-tab/album-and-author-adding-dashboard/album-and-author-adding-dashboard.component';
import { AddArtistComponent } from './components/contribute/contributor-dashboard/contribute-tab/add-artist/add-artist.component';
import { AddAlbumComponent } from './components/contribute/contributor-dashboard/contribute-tab/add-album/add-album.component';
import {Constants} from './constants/constants';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RouterModule.forRoot([
      {
        path: Constants.Routes.HOME,
        component: HomeComponent
      },
      {
        path: Constants.Routes.LYRICS_VIEW,
        component: LyricsviewComponent
      },
      {
        path: Constants.Routes.TOP_LYRICS,
        component: TopLyricsComponent
      },
      {
        path: Constants.Routes.CONTRIBUTE,
        component: ContributeComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo([Constants.Routes.LOGIN]) }
      },
      {
        path: Constants.Routes.LOGIN,
        component: LoginComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectLoggedInTo([Constants.Routes.CONTRIBUTE]) }
      },
      {
        path: Constants.Routes.ADD_ARTIST,
        component: AddArtistComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo([Constants.Routes.LOGIN]) }
      },
      {
        path: Constants.Routes.ADD_ALBUM,
        component: AddAlbumComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo([Constants.Routes.LOGIN]) }
      },
      {
        path: Constants.Routes.ABOUT,
        component: AboutComponent
      },
      {
        path: Constants.Routes.WILDCARD,
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
