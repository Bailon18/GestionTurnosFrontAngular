import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Ticket } from '../ticket';


@Component({
  selector: 'app-modal-llamar-cliente',
  templateUrl: './modal-llamar-cliente.component.html',
  styleUrls: ['./modal-llamar-cliente.component.css']
})
export class ModalLlamarClienteComponent {
  
  ticket: Ticket;
  mensaje: string;

  constructor(
    public dialogRef: MatDialogRef<ModalLlamarClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ticket
  ) {
    this.ticket = data;

    this.mensaje = `Ticket número ${this.ticket.numeroTicket}, cliente ${this.ticket.cliente.nombres}
     ${this.ticket.cliente.apellidoPaterno}, acérquese al ${this.ticket.modulo.nombre}`;

     this.llamarclientevoz(this.mensaje)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  llamarclientevoz(mensaje: string){
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-ES'; 
    speechSynthesis.speak(utterance);

    const duracionMensajeMs = mensaje.length * 100; 

    setTimeout(() => {
      this.dialogRef.close();
    }, duracionMensajeMs);
  }
  
}
