import { AuthService } from '@algorhythm/users';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

  constructor(private authService: AuthService){}

  ngOnInit(): void {}

  logoutUser() {
    this.authService.logout();
  }

}
