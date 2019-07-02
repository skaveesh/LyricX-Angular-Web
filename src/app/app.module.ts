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
  MatTooltipModule
} from '@angular/material';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {ToplyricsComponent} from './components/toplyrics/toplyrics.component';
import {ContributeComponent} from './components/contribute/contribute.component';
import {LyricsviewComponent} from './components/lyricsview/lyricsview.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AboutComponent} from './components/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FlexLayoutModule} from '@angular/flex-layout';
import { LoginComponent } from './components/contribute/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToplyricsComponent,
    ContributeComponent,
    LyricsviewComponent,
    NotfoundComponent,
    AboutComponent,
    LoginComponent
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
        component: ToplyricsComponent
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
        component: NotfoundComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
