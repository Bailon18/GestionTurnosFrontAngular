import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../login/model/usuario-logeo';
import { LoginService } from '../../login/login.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'] 
  })
  export class NavbarComponent implements OnInit {

    usuario: User;
    rolInicioSesion:string;
  
    constructor(
      private servicio: LoginService,
      public tokenService: TokenService,
      private router: Router
      ) { }
  
    ngOnInit(): void {

    }
  
    logOut() {
      this.tokenService.logOut();
      this.router.navigate(['/inicio'])
    }
  
  }