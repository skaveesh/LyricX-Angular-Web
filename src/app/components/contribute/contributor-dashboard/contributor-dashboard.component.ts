import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ContributorUtilService} from '../../../services/contributor-util.service';
import {filter} from 'rxjs/operators';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material';

@Component({
  selector: 'app-contributor-dashboard',
  templateUrl: './contributor-dashboard.component.html',
  styleUrls: ['./contributor-dashboard.component.css']
})
export class ContributorDashboardComponent implements OnInit, AfterViewInit {

  tab: number;

  @ViewChild('mainContributorTabGroup', {static: false}) tabGroup: MatTabGroup;

  constructor(private contributorUtilService: ContributorUtilService) {
    this.tab = 0;
  }

  ngOnInit() {
  }

  onTabChanged(matTabChangeEvent: MatTabChangeEvent) {
    this.contributorUtilService.sendContributorTabIndex(matTabChangeEvent.index, false);
  }

  ngAfterViewInit(): void {
    this.contributorUtilService.getContributorEditorFieldsResetStatus().pipe(filter((res: boolean) => res === true))
      .subscribe(() => this.tabGroup.selectedIndex = 1);

    this.contributorUtilService.getContributorTabIndex().pipe(filter(res => res !== null), filter(res => res.navigate === true))
      .subscribe( res => this.tabGroup.selectedIndex = res.contributorTabIndex);
  }

}
