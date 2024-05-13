
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';


import { UsuarioComponent } from './usuario/usuario.component';
import { MaterialModule } from '../../material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrearComponent } from './usuario/paginas/crear.component';
import { ProductosComponent } from './productos/productos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ModulosComponent } from './modulos/modulos.component';
import { AtencionColaComponent } from './atencion-cola/atencion-cola.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ModalCreacionServicioComponent } from './servicios/modal-creacion-servicio/modal-creacion-servicio.component';
import { VideoconfigComponent } from './videoconfig/videoconfig.component';
import { CrearVvideoComponent } from './videoconfig/crear-vvideo/crear-vvideo.component';




@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    UsuarioComponent,
    CrearComponent,
    ProductosComponent,
    ServiciosComponent,
    ModulosComponent,
    AtencionColaComponent,
    ReporteComponent,
    ModalCreacionServicioComponent,
    VideoconfigComponent,
    CrearVvideoComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
   
   
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class DashboardModule { }
