import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { RoleGuardService } from 'src/app/shared/guards/roleGuard.service';
import { ProductosComponent } from './productos/productos.component';
import { AtencionColaComponent } from './atencion-cola/atencion-cola.component';
import { ModulosComponent } from './modulos/modulos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { VideoconfigComponent } from './videoconfig/videoconfig.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'atencionturno',
        pathMatch: 'full',
      },
      {
        path: 'atencionturno',
        component: AtencionColaComponent,
      },
      {
        path: 'modulos',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'Administrador' },
        component: ModulosComponent,
      },

      {
        path: 'video',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'Administrador' },
        component: VideoconfigComponent,
      },
      {
        path: 'servicios',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'Administrador' },
        component: ServiciosComponent,
      },
      {
        path: 'reporte',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'Administrador' },
        component: ReporteComponent,
      },
      {
        path: 'usuarios',
        canActivate: [RoleGuardService],
        data: { expectedRole: 'Administrador' },
        component: UsuarioComponent,
      }
    ],
  },
  ,
  {
    path: '**',
    redirectTo: 'productos',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
