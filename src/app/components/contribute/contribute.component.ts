import {AfterViewInit, Component} from '@angular/core';
import {LoadingStatusService} from '../../services/loading-status.service';
import {UserAuthorizationService} from '../../services/auth/user-authorization.service';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css']
})
export class ContributeComponent implements AfterViewInit {

  constructor(public userAuth: UserAuthorizationService, private loadingStatus: LoadingStatusService) {
    loadingStatus.startLoading();
  }

  ngAfterViewInit() {
    this.userAuth.getUser().subscribe(() => {
      this.loadingStatus.stopLoading();
    });
  }

  refreshToken(forceRefresh: boolean) {
    this.userAuth.getRefreshToken(forceRefresh);
  }

  sendEmailConfirmation() {
    this.userAuth.sendEmailConfirmation();
  }

  logout() {
    this.userAuth.logout();
  }
}
