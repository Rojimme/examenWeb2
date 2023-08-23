import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoferesRoutingModule } from './choferes-routing.module';
import { ChoferesComponent } from './choferes.component';
import { LicenciasComponent } from './chofer/licencias/licencias.component';
import { MaterialModule } from 'src/app/material.module';
import { ChoferComponent } from './chofer/chofer.component';

@NgModule({
  declarations: [ChoferesComponent, LicenciasComponent, ChoferComponent],
  imports: [CommonModule, ChoferesRoutingModule, MaterialModule],
})
export class ChoferesModule {}
