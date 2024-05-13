import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swall from 'sweetalert2'; 
import { LoginService } from './login.service';

import { TokenService } from '../../shared/services/token.service';
import { User } from '../dashboard/usuario/model/usuario';
import { JwtDTO } from './model/jwt-dto';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
  })
export class LoginComponent implements OnInit{

  isLogin = false;
  isLoginError = false;
  roles: string[] = [];
  formulario: FormGroup;
  usuario: User;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servicioLogin: LoginService,
    private tokenService: TokenService,
  ) {
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.isLoginError = false;
  
    }


  }

  ingresar() {
    const username = this.formulario.value.username;
    const contrasena = this.formulario.value.password;

    this.servicioLogin.validarInicioSesion(username, contrasena).subscribe({
      next: (dato: JwtDTO) => {

        this.isLogin = true;
        this.isLoginError = false;

        this.tokenService.setModulo(dato.modulo)
        this.tokenService.setToken(dato.token!);
        this.tokenService.setUserName(dato.nombreUsuario!);
        this.tokenService.setAuthorities(dato.authorities!);
        this.tokenService.setUserId(dato.usuarioId);

        const nombre = this.tokenService.getUserName();
        const rolAutoridad: string | null = this.tokenService.getAuthorities();
        

        swall.fire({
          html: `<strong>${nombre.toLowerCase()}</strong> Iniciaste sesión como: <strong>${rolAutoridad}</strong>`,
          icon: 'success',
          confirmButtonColor: '#0275d8',
        });

        if(rolAutoridad === "ADMINISTRADOR"){
          this.router.navigate(['dashboard/usuarios']);
        }
        else{
          this.router.navigate(['dashboard/']);
        }

        


      },
      error: (error: any) => {
        swall.fire({
          html: 'Error al iniciar sesión',
          icon: 'error',
          confirmButtonColor: '#d80227',
        });

        this.isLogin = false;
        this.isLoginError = true;
  
      },
    });
  }


 }
