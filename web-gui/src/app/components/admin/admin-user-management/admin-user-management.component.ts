import {Component, OnInit, ViewChild} from '@angular/core';
import {DatabaseService, User} from '../../../service/database.service';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {flatMap} from 'rxjs/operators';

/**
 * This component is for admin managing
 * users
 */
@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss']
})
export class AdminUserManagementComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: DatabaseService, private snackBar: MatSnackBar) {
  }


  columns = ['surname', 'prename', 'email', 'username', 'last_login', 'role_id', 'action'];
  dataSource = new MatTableDataSource<User>();

  ngOnInit() {
    this.db.getAllUsers().subscribe(users => {
      this.dataSource.data = users;
      this.dataSource.sort = this.sort;
    });
  }


  /**
   * Admin selects new role for user
   * @param username The username of current user
   * @param userID The id of user
   * @param role Selected role from admin
   */
  roleChange(username: string, userID: number, role: number) {
    this.db.changeUserRole(userID, role).subscribe(res => {
      if (res.success) {
        this.snackBar.open(username + ' ist jetzt ' + res.grant, 'OK', {duration: 3000});
      } else {
        this.snackBar.open('Fehler', 'OK', {duration: 3000});
      }
    });
  }


  deleteUser(user: User) {
    this.db.adminDeleteUser(user.user_id).pipe(
      flatMap((result) => {

        if (result.deletion) {
          this.snackBar.open(user.username + ' wurde gelöscht');
        }

        return this.db.getAllUsers();
      })).subscribe(users => {
      this.dataSource.data = users;
    });

  }


  /**
   * Admin searches for user
   * @param filterValue String the admin provides to search for
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}