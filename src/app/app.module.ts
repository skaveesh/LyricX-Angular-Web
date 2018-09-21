import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ToplyricsComponent } from './components/toplyrics/toplyrics.component';
import { ContributeComponent } from './components/contribute/contribute.component';
import { LyricsviewComponent } from './components/lyricsview/lyricsview.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AboutComponent } from './components/about/about.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export const firebaseConfig = environment.firebase;

import { AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToplyricsComponent,
    ContributeComponent,
    LyricsviewComponent,
    NotfoundComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'lyrics/:artist/:song',
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
export class AppModule { }
