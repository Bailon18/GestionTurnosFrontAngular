import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Atencion } from './atenciones';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '../usuario/services/usuario.service';
import { AtencionesService } from './atenciones.service';
import { Ticket } from '../../lista-espera/ticket';
import { GenerarTicketService } from '../../generarticket/generar-ticket.service';
import { Cliente } from '../../generarticket/cliente';
import { Servicio } from '../servicios/servicio';
import { ListaEsperaComponent } from '../../lista-espera/lista-espera.component';
import { WebSocketService } from '../webSocketService';
import swall from 'sweetalert2';
import { interval } from 'rxjs/internal/observable/interval';
import { formatDate } from '@angular/common';
import { TokenService } from 'src/app/shared/services/token.service';



@Component({
  selector: 'app-atencion-cola',
  templateUrl: './atencion-cola.component.html',
  styleUrls: ['./atencion-cola.component.css']
})
export class AtencionColaComponent implements AfterViewInit, OnInit {

  estadoFiltro: any;
  selectedRow: Ticket;
  modulo_id: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['TICKET', 'FECHA', 'CLIENTE', 'SERVICIO', 'ESTADO', 'ACCIONES'];
  dataSource = new MatTableDataSource<Ticket>;

  constructor(
    private atencionSerice: GenerarTicketService,
    private webSocketService: WebSocketService,
    private atencionesService: AtencionesService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {

    const selectedTicketString = localStorage.getItem('selectedTicket');
    if (selectedTicketString) {
      const selectedTicket: Ticket = JSON.parse(selectedTicketString);
      this.selectedRow = selectedTicket;
    }

    const moduloo = this.tokenService.getModulo();
      if (moduloo !== null) {
        this.modulo_id =  moduloo.id
      } else {
        console.log('No se encontró ningún módulo almacenado.');
      }


    interval(2000).subscribe(() => {
      this.listarAtenciones();
    });

  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listarAtenciones() {
    let idModulo = this.modulo_id
    let estado = "Pendiente"
    return this.atencionSerice.listarTicketsPorEstadoYModulo(idModulo, estado).subscribe(
      {
        next: res => {
          this.dataSource = new MatTableDataSource(res)
          this.dataSource.paginator = this.paginator;
        },
        error: error => {

        }
      }
    )
  }

  seleccionarCliente(fila: Ticket) {
    this.selectedRow = fila;
    localStorage.setItem('selectedTicket', JSON.stringify(fila));
  }


  llamarCliente(selectedRow: Ticket) {
    if (selectedRow) {
      this.webSocketService.connect();
      setTimeout(() => {
        this.webSocketService.sendMessage(selectedRow);
      }, 500);

      this.atencionesService.llamarClienteAtencion(selectedRow.id, 'Acercarse').subscribe(res => {

        this.actualizarTicket(selectedRow.id);
      })



    } else {
      swall.fire({
        icon: 'error',
        confirmButtonColor: '#0275d8',
        html: `No se ha seleccionado ningún <strong>cliente</strong>`,
      })
    }
  }

  actualizarEstadoTicket(id: number, estado: string, tipo?: string): void {

    // LIMPIAR 
    if (tipo === 'limpiar') {

      this.atencionesService.llamarClienteAtencion(id, estado).subscribe(res => {
      })

      this.selectedRow = null;
      localStorage.removeItem('selectedTicket');
    }

    // INICIAR
    if (tipo == 'En proceso') {

      swall.fire({
        text: '¿Comenzar atención?',
        html: '¿Está seguro de que desea comenzar la atención?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          const atencion: Atencion = {
            ticket: { id: this.selectedRow.id },
            user: { id: 2 },
            modulo: { id: this.selectedRow.modulo.id },
            estado: "En proceso",
            fechaHoraInicio: new Date(),
            fechaHoraFin: null
          };
      
          // Llama al servicio para comenzar la atención y actualiza el ticket
          this.atencionesService.llamarClienteAtencion(id, estado).subscribe(res => {
            this.actualizarTicket(id);
          });
      
          // Guarda la información de la atención
          this.atencionesService.guardarAtenciones(atencion).subscribe(resp => {
            localStorage.setItem('atencionactual', JSON.stringify(resp));
          });
        }
      });

    }

    // FINALIZAR
    if (tipo == 'Finalizado') {
      swall.fire({
        title: '¿Finalizar atención?',
        text: '¿Está seguro de que desea finalizar la atención?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log("RETORNO: "+ result)
        if (result.isConfirmed) {
          const atencionActualString = localStorage.getItem('atencionactual');
          if (atencionActualString) {
            const atencionActual = JSON.parse(atencionActualString);
            const idAtencionActual = atencionActual.id;
            const fechaActual = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'es-PE');
            this.atencionesService.finalizarAtencion(idAtencionActual, fechaActual).subscribe(res => {
              swall.fire({
                text:'¡Finalizado con éxito!', 
                html:'La atención se ha finalizado correctamente.', 
                icon:'success'});
            });
            localStorage.removeItem('selectedTicket');
            this.selectedRow = null;
            localStorage.removeItem('atencionactual');
          } else {
            console.log('No se encontró ningún objeto en el almacenamiento local.');
          }
        }
      });
    }

    if(tipo == 'Ausente'){
      this.atencionesService.llamarClienteAtencion(id, estado).subscribe(res => {
        localStorage.removeItem('selectedTicket');
        this.selectedRow = null;
        localStorage.removeItem('atencionactual');
      })
    }
  }


  actualizarTicket(id: number) {

    this.atencionesService.buscarTicketId(id).subscribe({
      next: (data) => {
        this.selectedRow = data;
        localStorage.setItem('selectedTicket', JSON.stringify(data));
      }
    })
  }


}




