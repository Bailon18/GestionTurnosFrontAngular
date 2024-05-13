import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Atencion } from './atenciones';
import { Ticket } from '../../lista-espera/ticket';


@Injectable({
  providedIn: 'root'
})
export class AtencionesService {


  constructor(private http: HttpClient) { }

  guardarAtenciones(atencion: Atencion): Observable<Atencion> {
    return this.http.post<Atencion>(`${baseUrl}/atenciones/guardar`, atencion);
  }


  llamarClienteAtencion(idTicket: number, estado: string): Observable<void> {
    return this.http.post<void>(`${baseUrl}/atenciones/llamar/${idTicket}/${estado}`, {});
  }

  buscarTicketId(idTicket: number): Observable<Ticket> {
    const url = `${baseUrl}/tickets/${idTicket}`; 
    return this.http.get<Ticket>(url);
  }


  finalizarAtencion(id: number, fechafinalizado: string): Observable<void> {
    const url = `${baseUrl}/atenciones/${id}/${fechafinalizado}/finalizar`;
    return this.http.put<void>(url, {});
  }

  listarAtenciones(): Observable<Atencion[]> {
    return this.http.get<Atencion[]>(`${baseUrl}/atenciones`);
  }

}
