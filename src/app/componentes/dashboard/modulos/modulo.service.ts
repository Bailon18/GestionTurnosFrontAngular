import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/app/helpers';
import { Observable } from 'rxjs';
import { Modulo } from './modulo';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {


  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }


  getModulo(): Observable<Modulo[]>{
    return this.http.get<Modulo[]>(`${baseUrl}/modulos`);
  }

  buscarModuloId(id:number): Observable<Modulo>{
    return this.http.get<Modulo>(`${baseUrl}/modulos/${id}`);
  }

  guardarModulo(modulo: Modulo):Observable<Modulo>{
    return this.http.post<Modulo>(`${baseUrl}/modulos`, modulo, {headers: this.httpHeaders});
  }

  actualizarModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.put<Modulo>(`${baseUrl}/modulos/${modulo.id}`, modulo);
  }

  cambiarEstado(id: number, estado: boolean): Observable<any> {
    return this.http.post(`${baseUrl}/modulos/desabilitar/${id}/${estado}`, {});
  }

}
