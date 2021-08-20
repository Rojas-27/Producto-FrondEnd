import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from './shared/services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  title = 'sistema-ventas-app';
  opened = false;

  constructor(private utilsSvc: UtilsService) {}

  ngOnInit(): void {
    this.utilsSvc.sidebarOpened$
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: boolean) => this.opened = res);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
