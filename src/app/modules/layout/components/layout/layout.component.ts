import { Component, OnInit } from '@angular/core';

import { AutService } from '@services/aut.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit{
  constructor(private authService: AutService) {}

  ngOnInit() {
    this.authService.getProfile()
    .subscribe();
  }

}
