import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBell,
  faInfoCircle,
  faClose,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import { Colors, NAVBAR_BACKGROUNDS } from '@models/colors.model';

import { AutService } from '@services/aut.service';
import { BoardsService } from '@services/boards.service';
import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;

  user$ = this.authService.user$;
  navBarBackgroundColor: Colors = 'sky';
  navBarColors = NAVBAR_BACKGROUNDS;

  constructor(private authService : AutService,
    private router: Router,
    private tokenService: TokenService,
    private boardsService: BoardsService
  ) {
    this.boardsService.backgroundColor$
    .subscribe(color => {
      this.navBarBackgroundColor = color;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isValidToken() {
    console.log(this.tokenService.isValidToken());
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = event;
  }

  get colors() {
    const classes = this.navBarColors[this.navBarBackgroundColor];
    return classes ? classes : {};
  }
}
