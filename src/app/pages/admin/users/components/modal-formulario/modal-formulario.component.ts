import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '@app/pages/admin/services/users.service';
import { AuthService } from '@app/pages/auth/auth.service';
import { Rol } from '@app/shared/models/rol.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
enum Action{
  EDIT = "edit",
  NEW = "new"
}

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.scss']
})
export class ModalFormularioComponent implements OnInit, OnDestroy {

  // Variables
  actionTODO = Action.NEW;

  
  private destroy$ = new Subject<any>();
  roles: Rol[] = [];

  userForm = this.fb.group({
    cvePro : [''],
    nombre : ['', [Validators.required]],
    des : ['', [Validators.required]],
    precio : ['', [Validators.required]],
    rol : ['', [Validators.required]],
    cveReg : this.authSvc.userValue?.cveUsuario
  })

  constructor(public dialogRef: MatDialogRef<ModalFormularioComponent> ,@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private UsersSvc: UsersService, private _snackBar: MatSnackBar,private authSvc: AuthService) { }

  ngOnInit(): void {
    this.getRoles();

    if(this.data?.user.hasOwnProperty("cvePro")){
      this.actionTODO = Action.EDIT;
      this.data.title = "Editar producto"
      this.editar()
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete()
  }

  private getRoles(): void {
    this.UsersSvc.getRol()
    .pipe(takeUntil(this.destroy$))
    .subscribe(roles => this.roles = roles)
  }

  onSave(): void
  {
    if(this.userForm.invalid){
      return;
    const formValue = this.userForm.value;

    console.log(formValue)
    }
    const formValue = this.userForm.value;
    if(this.actionTODO == Action.NEW) {
      const {cveRol, ...rest} = formValue;
      this.UsersSvc.new(rest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this._snackBar.open(result.message, '', {
          duration: 6000
        });
        this.dialogRef.close(true);
      });
    }else{
      // Actualizar
      const {cveRol, ...rest} = formValue;
      this.UsersSvc.update(rest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this._snackBar.open(result.message, '', {
          duration: 6000
        });
        this.dialogRef.close(true);
      });
    }
  }

  private editar(): void{
    this.userForm.patchValue({
      cvePro : this.data?.user.cvePro,
      nombre : this.data?.user.nombre,
      des: this.data?.user.des,
      precio: this.data?.user.precio,
      rol : this.data?.user.rol,
      cveReg : this.data?.user.cveReg
    });
  }

  getErrorMessage(field: string): string{
    let message = "";

    const element = this.userForm.get(field);

    if(element?.errors){
      const messages: any = {
        required : "Este campo es requerido",
        email : "El formato no es correcto",
        minLength : "Los caracteres minimos son 4"
      };

      const errorKey = Object.keys(element?.errors).find(Boolean);
      message = String(messages[String(errorKey)]);
    }

    return message;
  }

}
