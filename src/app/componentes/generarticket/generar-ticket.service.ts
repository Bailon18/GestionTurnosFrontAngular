import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { Cliente } from './cliente';
import { Ticket } from '../lista-espera/ticket';

@Injectable({
  providedIn: 'root'
})
export class GenerarTicketService {


  constructor(private http: HttpClient) { }

  buscarCliente(numero: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${baseUrl}/clientes/dni/${numero}`);
  }

  guardarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${baseUrl}/clientes`, cliente);
  }

  guardarTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${baseUrl}/tickets`, ticket);
  }

  getTotalTicketsByServicio(idServicio: number): Observable<any[]> {
    const url = `${baseUrl}/modulos/buscarServicio/${idServicio}`;
    return this.http.get<any[]>(url);
  }

  buscarClientePorDni(dni: string): Observable<Cliente> {
    const url = `${baseUrl}/clientes/buscarPorDni/${dni}`;
    return this.http.get<Cliente>(url);
  }


  listarTicketsPorEstadoYModulo(moduloId: number, estado: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${baseUrl}/tickets/listarTicketsModuloEstado/${moduloId}/${estado}`);
  }

}
