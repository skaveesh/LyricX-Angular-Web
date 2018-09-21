import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  songsCollection: AngularFirestoreCollection<Song>;
  songs: Observable<Song[]>;

  constructor(private afirestore: AngularFirestore) { }

  ngOnInit() {
    this.songsCollection = this.afirestore.collection('lyrics');
    this.songs = this.songsCollection.valueChanges();
  }

}
