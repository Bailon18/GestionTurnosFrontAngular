import { NgModule } from '@angular/core';
import { LoginComponent } from './componentes/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/authGuards.service';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { GenerarticketComponent } from './componentes/generarticket/generarticket.component';
import { ListaEsperaComponent } from './componentes/lista-espera/lista-espera.component';


const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'listaespera', component: ListaEsperaComponent },
  { path: 'tickets', component: GenerarticketComponent },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./componentes/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '**', redirectTo: 'inicio' }
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
