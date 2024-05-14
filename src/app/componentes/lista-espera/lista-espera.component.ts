import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from './ticket';
import { ListaEsperaService } from './listaespera.service';
import { Subscription, interval, map } from 'rxjs';
import { WebSocketService } from '../dashboard/webSocketService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalLlamarClienteComponent } from './modal-llamar-cliente/modal-llamar-cliente.component';
import { VideosService } from '../dashboard/videoconfig/video.service';
import { VideoSalaEspera } from '../dashboard/videoconfig/video';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.component.html',
  styleUrls: ['./lista-espera.component.css']
})
export class ListaEsperaComponent implements AfterViewInit, OnInit{

  llamadoClienteSubscription: Subscription;

  fechaActual: Date;
  datosCliente: Ticket | null = null;
  videoss: SafeUrl;
  
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['CODIGO', 'NOMBRE', 'MODULO', 'ESTADO'];
  dataSource = new MatTableDataSource<Ticket>;
  modalRef: MatDialogRef<ModalLlamarClienteComponent>;
 

  constructor(
    private webSocketService: WebSocketService,
    private servicio: ListaEsperaService,
    public dialog: MatDialog,
    private videoService: VideosService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnDestroy() {
    this.webSocketService.disconnect();
    if (this.llamadoClienteSubscription) {
      this.llamadoClienteSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.obtenerEventoLLamado()
    this.obtenerVideoSalaEspera()

    interval(61000).subscribe(() => {
      this.obtenerVideoSalaEspera()
    });

    interval(1000).subscribe(() => {
      this.fechaActual = new Date();
    });

    interval(2000).subscribe(() => {
      this.listadoGeneralTicket();
    });

  }



  obtenerVideoSalaEspera(): void {
    this.videoService.buscarVideoSeleccionado().pipe(
      map((resp: VideoSalaEspera) => {
        const url = 'data:video/mp4;base64,' + resp.video;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    ).subscribe({
      next: (videoss: SafeResourceUrl) => {
        this.videoss = videoss;
        console.log(this.videoss);
      },
      error: (error: any) => {
        console.error('Error al obtener el video de la sala de espera:', error);
      }
    });
  }
  

 
  obtenerEventoLLamado(){

    this.webSocketService.connect();
    this.webSocketService.response.subscribe ({

      next: data => {

        this.abrirDialogLlamarCliente(data);

      }, error : error => {
        console.log(error)
      }

    })

  }


  abrirDialogLlamarCliente(data: Ticket): void {  



    if (this.modalRef) {
      this.modalRef.close();
    }

    this.modalRef = this.dialog.open(ModalLlamarClienteComponent, {
      width: '550px',
      data: data
    });

  }


  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
    

  }

  listadoGeneralTicket(){
    return this.servicio.listarTicket().subscribe(
      {next: res => {
        console.log(res)
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        },
        error: error => {
          console.log("Ocurrio un error en la carga")
        }
      }
    )
  
  }




}
