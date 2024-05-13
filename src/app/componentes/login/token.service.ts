import { Injectable } from '@angular/core';



const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() { 
  }

  // guardamos el token
  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  // obtenemos el toke
  public getToken(): string|null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // guardamos el nombre del usuario logeado
  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  // obtenemos el nombre del usuario logeado
  public getUserName(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  // añadimos el rol usuario logeado
  public setAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  // obtenemos el rol del usuario del logeado
  public getAuthorities(): string | null {
    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
        const authorities = JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!);
        if (authorities.length > 0) {
            return authorities[0].authority;
        }
    }
    return null;
  }


  // cuando cerramos sesion , limpiamos el sessionStorage
  public logOut(): void {
    window.sessionStorage.clear();
  }

  // Método para obtener el estado de autenticación como Observable<boolean>
  public estaAutenticado(): boolean {
    if(this.getToken() != null ){
      return true;
    }else{

      return false;
    }
  }

}
