import { Component, OnInit } from '@angular/core';

import { DataSourceUser } from './data-source';
import { UsersService } from '@services/users.service';
import { AutService } from '@services/aut.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html'
})
export class UsersTableComponent implements OnInit  {

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];
  user: User | null = null;

  constructor( private usersService: UsersService,
    private authService: AutService
  ) {

    // this.dataSource.init([
    //   {
    //     id: 1,
    //     name: 'User 1',
    //     email: 'mail@mail.com',
    //     avatar: 'https://api.lorem.space/image/face?w=150&h=150'
    //   },
    //   {
    //     id: 2,
    //     name: 'User 2',
    //     email: 'mail2@mail.com',
    //     avatar: 'https://api.lorem.space/image/face?w=150&h=150'
    //   },
    //   {
    //     id: 3,
    //     name: 'User 3',
    //     email: 'mail3@mail.com',
    //     avatar: 'https://api.lorem.space/image/face?w=150&h=150'
    //   }
    // ]);
  }
  ngOnInit(): void {
    this.getUsers();
    this.authService.user$
    .subscribe(user => {
      this.user = user;
    });
  }

  getUsers() {
    this.usersService.getUsers()
    .subscribe(user => {
      this.dataSource.init(user);
    });
  }

}
