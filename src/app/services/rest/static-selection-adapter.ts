import {HttpRoot} from './http-root';
import {BehaviorSubject} from 'rxjs';

export abstract class StaticSelectionAdapter extends HttpRoot {

  public allSelections: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public abstract getAllSelections(): void;

}
