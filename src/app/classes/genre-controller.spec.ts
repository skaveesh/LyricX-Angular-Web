import { GenreController } from './genre-controller';
import {GenreAdapterService} from '../services/rest/genre-adapter.service';
import {FormControl} from '@angular/forms';

describe('GenreController', () => {
  it('should create an instance', () => {
    expect(new GenreController(new GenreAdapterService(), new FormControl())).toBeTruthy();
  });
});
