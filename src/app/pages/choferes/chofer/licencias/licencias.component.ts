import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LicenciasService } from 'src/app/shared/services/licencias.service';


// COMPONENTES DE LICENCIA

@Component({
  selector: 'app-licencias',
  templateUrl: './licencias.component.html',
  styleUrls: ['./licencias.component.scss'],
})

// mostrar datos en una tabla MatTableDataSource donde la podemos ver en mysql 
export class LicenciasComponent {
  dataSource = new MatTableDataSource();

  // Estas son las columnas y todas son string, de manera más sencilla, ya que logra no pedir tanto por una int
  displayedColumns: string[] = ['id', 'nombre', 'agregar'];

  constructor(private srvLicencias: LicenciasService) { }

  ngOnInit() {
    this.srvLicencias.getAll().subscribe(
      (datos) => {
        this.dataSource.data = datos;
      },
      (error) => {
        alert(error);
      }
    );
  }
}
