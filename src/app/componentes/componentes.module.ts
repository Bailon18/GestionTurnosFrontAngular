import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { InicioComponent } from './inicio/inicio.component';
import { GenerarticketComponent } from './generarticket/generarticket.component';
import { CommonModule } from '@angular/common';
import { ListaEsperaComponent } from './lista-espera/lista-espera.component';
import { ModalLlamarClienteComponent } from './lista-espera/modal-llamar-cliente/modal-llamar-cliente.component';



@NgModule({
  declarations: [
    LoginComponent,
    InicioComponent,
    GenerarticketComponent,
    ListaEsperaComponent,
    ModalLlamarClienteComponent,
  ],
  
  exports:[
    LoginComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule
  ]
})
export class ComponentesModule { }
