import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {TitlebarService} from '../../service/titlebar.service';
import {Subscription} from 'rxjs';

/**
 * Root component shows sidenav and titlebar
 */
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {

  constructor(private user: UserService, private router: Router, private auth: AuthService,
              private titlebar: TitlebarService) {
  }

  private sub: Subscription;

  title: string;
  userRole: number;
  isAdmin: boolean;
  isDocent: boolean;
  isModerator: boolean;
  isTutor: boolean;
  isStudent: boolean;

  opened: boolean;
  username: string;
  prename: string;
  surname: string;
  email: string;

  ngOnInit() {

    this.username = this.user.getUsername();
    this.userRole = this.user.getUserRole();
    this.prename = this.user.getPrename();
    this.surname = this.user.getSurname();
    this.email = this.user.getEmail();

    switch (this.userRole) {
      case 1:
        this.isAdmin = true;
        // this.router.navigate(['admin', 'dashboard']);
        break;
      case 2:
        this.isModerator = true;
        break;
      case 4:
        this.isDocent = true;
        break;
      case 8:
        this.isTutor = true;
        break;
      case 16:
        this.isStudent = true;
        break;
    }

    this.sub = this.titlebar.getTitle().subscribe(title => this.title = title);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
