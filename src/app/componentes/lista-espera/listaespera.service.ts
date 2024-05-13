import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Ticket } from './ticket';


@Injectable({
  providedIn: 'root'
})
export class ListaEsperaService {

  constructor(private http: HttpClient) { }

  listarTicket(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${baseUrl}/atenciones/tickets-pendientes-y-en-atencion`);
  }


}
