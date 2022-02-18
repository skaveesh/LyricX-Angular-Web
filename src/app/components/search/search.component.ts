import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  private _query = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe((res) => {
      this._query = res.get('query');
    });
  }

  get query(): any {
    return this._query;
  }
}
