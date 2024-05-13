import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Servicio } from './servicio';



@Injectable({
  providedIn: 'root'
})
export class ServiciosService {


  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listarServicios(): Observable<Servicio[]>{
    return this.http.get<Servicio[]>(`${baseUrl}/servicios`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<any> {
    return this.http.post(`${baseUrl}/servicios/cambiar-estado/${id}/${estado}`, {});
  }
  
  buscarServicioId(id:number): Observable<Servicio>{
    return this.http.get<Servicio>(`${baseUrl}/servicios/${id}`);
  }

  guardarServicio(dato: FormData): Observable<any> {
    return this.http.post(`${baseUrl}/servicios`, dato);
  }

  actualizarServicio(id: number, dato: FormData): Observable<any> {
    return this.http.put(`${baseUrl}/servicios/${id}`, dato);
  }


}
