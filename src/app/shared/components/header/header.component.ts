import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy = new Subject<any>();
  rol = "";
  isLogged = false;
  username = ""; 
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private authSvc: AuthService) {
  }

  ngOnInit(): void {
    this.authSvc.user$
      .pipe(takeUntil(this.destroy))
      .subscribe(user => {
        if (user) {
          this.isLogged = true;
          this.rol = user.rol;
          this.username = user.username;
        } else {
          this.isLogged = false;
          this.rol = "";
          this.username = "";
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next({});
    this.destroy.complete();
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authSvc.logout();
  }

}
