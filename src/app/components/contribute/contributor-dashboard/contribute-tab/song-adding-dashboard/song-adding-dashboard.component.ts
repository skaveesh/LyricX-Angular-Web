import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocomplete} from '@angular/material';
import {GenreAdapterService} from '../../../../../services/rest/genre-adapter.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-song-adding-dashboard',
  templateUrl: './song-adding-dashboard.component.html',
  styleUrls: ['./song-adding-dashboard.component.css']
})
export class SongAddingDashboardComponent implements OnInit {

  @Input() songAddingDashboardFormGroup: FormGroup;

  songNameCtrl = new FormControl();

  genreCtrl = new FormControl();
  filteredGenre: Observable<string[]>;
  genre: string[] = [];
  displayedGenre: string[] = [];

  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteGenre', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private _formBuilder: FormBuilder, private genreAdapter: GenreAdapterService) {

    this.genreAdapter.getAllGenres();
  }

  ngOnInit() {
    this.songAddingDashboardFormGroup = this._formBuilder.group({
      songNameCtrl: ['', Validators.required],
      genreCtrl: ''
    });

  }



}
