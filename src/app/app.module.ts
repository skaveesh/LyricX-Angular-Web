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
  MatSnackBarModule
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
import { MyProfileComponent } from './components/contribute/contributor-dashboard/my-profile/my-profile.component';

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
    MyProfileComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
