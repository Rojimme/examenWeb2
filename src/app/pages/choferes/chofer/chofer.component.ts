import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChoferForm } from 'src/app/shared/formsModels/choferForms';
import { ChoferService } from 'src/app/shared/services/chofer.service';
import { LicenciasComponent } from 'src/app/pages/choferes/chofer/licencias/licencias.component';
import { LicenciaChofer } from 'src/app/shared/models/choferLicencias';




@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.component.html',
  styleUrls: ['./chofer.component.scss'],
})

// Aquí se define la clase ChoferComponent que implementa la interfaz OnInit, ES PARTE COMO UN CICLO DE VIDA
// EL ELEMENTO NO CONTENDRÁ NINGÚN ELEMENTO INICIAL
export class ChoferComponent implements OnInit {
  arrayLicencias: LicenciaChofer[] = [];

  // ESTE ES EL CONSTRUCTOR DE LA CLASE, DONDE TIENE SUS INSTANCIAS
  constructor(
    private srvChofer: ChoferService,
    public choferForm: ChoferForm,
    private dialog: MatDialog
  ) { }

  // FUNCIÓN PARA ELIMINAR LAS LICENCIAS, EL li es la condición para que el arreglo sea diferente
  ngOnInit() { }

  eliminarLicencia(licencia: LicenciaChofer) {
    this.arrayLicencias = this.arrayLicencias.filter((li) => li !== licencia);
  }



  // Función de guardar a los choferes, donde si no se cumple el if se devolverá un alert
  guardarChofer() {
    if (this.validarLicencias()) {
      this.choferForm.baseForm.patchValue({
        licencias: this.arrayLicencias.map((li) => ({ id: li.licencia.id })),
      });

      if (this.choferForm.baseForm.valid) {
        this.insertarChofer();
      } else {
        alert('Ocurrió un error al completar esto, lo sentimos');
      }
    } else {
      alert('Lo sentimos, no se puede guardar sin licencia');
    }
  }

  // PARA ABRIR UN DIÁLOGO que muestra en la interfaz de usuario donde se puede presentar información que sea adicional
  // esto es algo propio de angular

  abrirDialogLicencias(): void {
    const dialogRef = this.dialog.open(LicenciasComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((eleccion: any) => {
      if (eleccion && eleccion.id && !this.existeLicencia(eleccion.id)) {
        const licenciaChofer: LicenciaChofer = {
          id: '',
          chofer: null,
          licencia: eleccion,
        };
        this.arrayLicencias.push(licenciaChofer);
      }
    });
  }



  // RETORNA UN VALOR BOOLEANO
  private validarLicencias(): boolean {

    // Es una comparación que evalúa si la longitud del arreglo es mayor que cero. Si se encuentra verdadera,
    // significa que el arreglo tiene al menos un elemento y si es falsa, significa que está vacío
    return this.arrayLicencias.length > 0;
  }


  // FUNCIÓN DE AÑADIR CHOFER, DONDE SE ENVÍA UN ALERT PROTIVO Y OTRO NEGATIVO
  private insertarChofer() {
    this.srvChofer.insert(this.choferForm.baseForm.value).subscribe(
      () => {
        this.limpiarFormulario();
        alert('Felicidades, se ha guardado de manera correcta');
      },
      (error: any) => {
        alert(error);
      }
    );
  }
  private existeLicencia(id: string): boolean {
    return this.arrayLicencias.some((licencia) => licencia.licencia.id === id);
  }

  private limpiarFormulario() {
    this.arrayLicencias = [];
    this.choferForm.baseForm.reset();
  }
}
