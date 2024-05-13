import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {


  constructor(private route: Router){

  }


  redirect(ruta: string) {
    this.route.navigate([ruta]);
  }

}
