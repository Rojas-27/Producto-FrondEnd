import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Menu } from '@app/shared/models/menu.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  lstMenu: Menu[] = [];

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.authSvc.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.lstMenu = [];
        if(user){
          if (user.rol == 'admin') {
            this.lstMenu = [
              {
                nombre: 'Producto',
                icono: 'category',
                ruta: '/admin/users'
              }
            ];
          } else if(user.rol == 'ventas') {
            this.lstMenu = [
              {
                nombre: 'Ventas',
                icono: 'shopping_bag',
                ruta: '/ventas/ventas'
              }
            ];
          }
        }
        
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  onExit(): void {
    this.authSvc.logout();
  }

}
