import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import baseUrl from '../../helpers';

import { JwtDTO } from './model/jwt-dto';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validarInicioSesion(username: string, contrasena: string): Observable<JwtDTO> {
    const usuarioLogeado = { username, contrasena };
    return this.http.post<JwtDTO>(`${baseUrl}/auth/login`, usuarioLogeado);
  }


}
