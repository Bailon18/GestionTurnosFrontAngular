import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Ticket } from '../lista-espera/ticket';
import baseUrl from 'src/app/helpers';



@Injectable({
  providedIn: 'root'
})
export class WebSocketService {


  private stompClient: Stomp.Clienteent;
  private ticketSubject: Subject<any> = new Subject<any>();
  public response: Observable<any> = this.ticketSubject.asObservable();

  private listaTicketsSubject: Subject<any> = new Subject<any>();
  public response2: Observable<any> = this.ticketSubject.asObservable();

  constructor() { }

  public connect(): void {

    const socket = new SockJS(baseUrl +'/llamar');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {

      this.stompClient.subscribe('/topic/llamar', (message) => {
        this.ticketSubject.next(JSON.parse(message.body));
      });

    });
    
  }
  

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  public sendMessage(message: any): void {
    if (this.stompClient) {
      this.stompClient.send('/app/llamar', {}, JSON.stringify(message));
    }
  }

  // Método para suscribirse a los tickets recibidos del servidor WebSocket
  public subscribeToTickets(): Observable<any> {
    return this.ticketSubject.asObservable();
  }
}
