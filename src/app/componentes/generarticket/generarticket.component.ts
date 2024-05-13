import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GenerarTicketService } from './generar-ticket.service';
import { Cliente } from './cliente';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiciosService } from '../dashboard/servicios/servicios.service';
import { Servicio } from '../dashboard/servicios/servicio';
import swall from 'sweetalert2';
import { Ticket } from '../lista-espera/ticket';

import { jsPDF } from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Atencion } from '../dashboard/atencion-cola/atenciones';
import { AtencionesService } from '../dashboard/atencion-cola/atenciones.service';
import { WebSocketService } from '../dashboard/webSocketService';


// Inicializar pdfMake con las fuentes necesarias
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-generarticket',
  templateUrl: './generarticket.component.html',
  styleUrls: ['./generarticket.component.css']
})
export class GenerarticketComponent implements OnInit {

  // Variable para almacenar el servicio seleccionado
  servicioSeleccionado: any;

  cliente: Cliente = {};
  servicios: Servicio[] = [];
  @ViewChild('numDocInput') numDocInput: ElementRef<HTMLInputElement>;

  constructor(
    private servicioService: ServiciosService,
    private sanitizer: DomSanitizer,
    private servicio: GenerarTicketService,
    private atencionesService: AtencionesService,

  ) { }


  ngOnInit() {
    this.servicioService.listarServicios().subscribe({
      next: (resp) => {
        this.servicios = resp
          .filter(servicio => servicio.activo === true)
          .map(servicio => {
            return {
              ...servicio,
              imagen: this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + servicio.imagen)
            };
          });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addToNumDoc(num: string, inputField: HTMLInputElement): void {
    inputField.value += num;
  }

  limpiarNumeroDocumento(inputField: HTMLInputElement): void {
    inputField.value = '';
    this.cliente = {};
  }

  deleteFromNumDoc(inputField: HTMLInputElement): void {
    inputField.value = inputField.value.slice(0, -1);
    this.cliente = {};
  }

  capitalizarPrimeraLetra(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  onAceptarClick(numeroDocumento: string): void {

    const digitosRegExp: RegExp = /^\d+$/;

    const documentoString: string = numeroDocumento.trim();

    if (documentoString.length !== 8 || !digitosRegExp.test(documentoString)) {
      if (documentoString.length !== 8) {

        swall.fire({
          icon: 'error',
          title: 'Error',
          html: 'El número de documento debe tener exactamente 8 dígitos.'
        });
      }

      if (!digitosRegExp.test(documentoString)) {
        swall.fire({
          icon: 'error',
          title: 'Error',
          html: 'El número de documento debe contener solo números.'
        });
      }

      return;
    }

    const documentoNumero: number = parseInt(documentoString);


    this.buscarCliente(documentoNumero);
  }

  buscarCliente(documentoNumero: number): void {

    this.servicio.buscarCliente(documentoNumero).subscribe(
      (respuesta) => {
        if (respuesta.apellidoMaterno != "") {
          this.cliente = respuesta;
          this.cliente.nombres = this.capitalizarPrimeraLetra(respuesta.nombres);
          this.cliente.numeroDocumento = respuesta.numeroDocumento;
          this.cliente.apellidoPaterno = this.capitalizarPrimeraLetra(respuesta.apellidoPaterno) + ' ' + this.capitalizarPrimeraLetra(respuesta.apellidoMaterno);
        } else {
          swall.fire({
            icon: 'error',
            title: 'Error',
            html: 'No se encontró ningún cliente con el número de documento proporcionado.'
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  tieneDatosCliente(): boolean {
    return Object.keys(this.cliente).length > 0;
  }

  onClickGenerarTicket() {

    if (this.servicioSeleccionado) {
        const servicioId = this.servicioSeleccionado.id;
        const servicioNombre = this.servicioSeleccionado.nombreServicio;
        this.onClickBoton(servicioId, servicioNombre);
    }
}

  onClickBoton(servicioId: number, servicioNombre: string): void {


    this.servicio.getTotalTicketsByServicio(servicioId).subscribe(
      
      (modulos: any[]) => {
        if (modulos.length > 0) {
          const moduloId: number = modulos[0].idModulo;

          this.servicio.buscarClientePorDni(this.cliente.numeroDocumento).subscribe(
            (cliente: Cliente) => {
              if (cliente) {
                this.guardarTicket(servicioId, servicioNombre, moduloId, cliente.id);
              } else {
                this.guardarNuevoCliente(servicioId, servicioNombre, moduloId);
              }
            },
            (error) => {
              if (error.status === 404) {
                this.guardarNuevoCliente(servicioId, servicioNombre, moduloId);
              } else {
                console.error('Error al buscar cliente por DNI:', error);
              }
            }
          );
        } else {
          swall.fire({
            icon: 'error',
            title: 'Error',
            html: 'No se encontraron módulos para el servicio seleccionado'
          });

        }
      },
      (error) => {
        console.error('Error al obtener la lista de módulos:', error);
      }
    );
  }


  guardarNuevoCliente(servicioId: number, servicioNombre: string, moduloId: number): void {

    this.cliente.apellidoPaterno = this.cliente.apellidoPaterno.split(' ')[0];

    this.servicio.guardarCliente(this.cliente).subscribe(
      (cliente: Cliente) => {
        this.guardarTicket(servicioId, servicioNombre, moduloId, cliente.id);
      },
      (error) => {
        console.error('Error al crear el cliente:', error);
      }
    );
  }

  guardarTicket(servicioId: number, servicioNombre: string, moduloId: number, clienteId: number): void {
    const ticket: Ticket = {
      servicio: { id: servicioId, nombreServicio: servicioNombre },
      cliente: { id: clienteId },
      modulo: { id: moduloId },
      estado: 'Pendiente',
      fecha: new Date()
    };

    this.servicio.guardarTicket(ticket).subscribe(

      (resp) => {

        this.cliente = {};
        this.numDocInput.nativeElement.value = '';
        this.servicioSeleccionado = null

        const numeroTicket = resp.numeroTicket;
        const nombreModulo = resp.modulo.nombre;
        const nombreservicio = resp.servicio.nombreServicio

        const fecha = resp.fecha

        const fechaFormateada = this.formatearFecha(fecha);

        this.generarContenidoTicket(numeroTicket, nombreModulo, fechaFormateada, nombreservicio);

      
      },
      (error) => {
        swall.fire({
          icon: 'error',
          title: 'Error',
          html: 'Error al crear el ticket.'
        });
      }
    );

  }

  generarContenidoTicket(numeroTicket: string, nombreModulo: string, fecha: any, nombreservicio: string): void {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 100]
    });

    const styles = {
      header: {
        fontSize: 16,
        fontStyle: 'bold',
        marginBottom: 5
      },
      content: {
        fontSize: 12,
        marginBottom: 3
      }
    };

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(styles.header.fontSize);
    pdf.text("Bienvenido a BNP", 10, 10);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(styles.content.fontSize);
    pdf.text("N* Ticket: " + numeroTicket, 10, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.text("Asignado al módulo: " + nombreModulo, 10, 30);
    pdf.text("Servicio: " + nombreservicio, 10, 40);

  

  
    pdf.text("Fecha: " + fecha, 10, 50);
    
  
    const pdfDataUri = pdf.output('datauristring');

    const byteCharacters = atob(pdfDataUri.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 9000);
    };
    
  }


  formatearFecha(fecha) {
    const fechaFormateada = new Date(fecha);
    const year = fechaFormateada.getFullYear();
    const month = ('0' + (fechaFormateada.getMonth() + 1)).slice(-2); 
    const day = ('0' + fechaFormateada.getDate()).slice(-2);
    const hour = ('0' + fechaFormateada.getHours()).slice(-2);
    const minute = ('0' + fechaFormateada.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }


}  
