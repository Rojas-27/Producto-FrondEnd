import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from '../loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _dialogRef: MatDialogRef<LoadingComponent> | undefined;

  private _config: MatDialogConfig = {
    disableClose: true
  };

  constructor(public dialog: MatDialog) { }

  toggle(loading: boolean): void{
    if(loading && (this._dialogRef === null || typeof this._dialogRef == 'undefined')) {
      this._dialogRef = this.dialog.open(LoadingComponent, this._config);
    } else if (this._dialogRef != null && !loading && typeof this._dialogRef != 'undefined') {
      this._dialogRef.close();
      this._dialogRef = undefined;
    }
  }
}
