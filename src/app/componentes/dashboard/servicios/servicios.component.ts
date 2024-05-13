import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Servicio } from './servicio';
import { ServiciosService } from './servicios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import swall from 'sweetalert2';
import { ModalCreacionServicioComponent } from './modal-creacion-servicio/modal-creacion-servicio.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements AfterViewInit, OnInit{

  servicios: Servicio[] = [];

  estadoFiltro: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  columnas: string[] = ['ID', 'IMAGEN', 'SERVICIO', 'ESTADO', 'ACCIONES'];
  dataSource = new MatTableDataSource<Servicio>;

  constructor(
    private servicioService: ServiciosService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }



  ngOnInit() {
    this.listadoGeneralServicio(true);
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


  listadoGeneralServicio(estado: boolean) {
    return this.servicioService.listarServicios().subscribe({
      next: res => {

        let filtrado = res.filter(p => p.activo === estado);
        filtrado.forEach(item => {
          item.imagen = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item.imagen);
        });
        this.dataSource = new MatTableDataSource(filtrado);
        this.dataSource.paginator = this.paginator;
      },
      error: error => {
        swall.fire({
          icon: 'success',
          html: 'Error en cargar productos: ' + error,
        });
      }
    });
  }

  mostrarInactivos() {

    if (!this.estadoFiltro) {
      this.listadoGeneralServicio( true );
    } else {
      this.listadoGeneralServicio( false );
    }
  }


  abrirDialogoNuevoServicio() {
    this.dialog.open(ModalCreacionServicioComponent, {
      minWidth:'35%'
    }).afterClosed().subscribe(valor => {
      
      this.listadoGeneralServicio( true );
      
    });
  }

  editarServicio(fila: any) {
    this.dialog.open(ModalCreacionServicioComponent, {
      minWidth:'40%',
      data:fila
    }).afterClosed().subscribe(valor => {
      
      this.listadoGeneralServicio( true );
      
    });
  }


  cambiarEstadoServicio(fila: any) {

    const esBloqueo = !fila.activo;
    const accion = !esBloqueo ? 'bloquear' : 'habilitar';
    const pregunta = `¿Estás seguro de ${accion} a <strong>${fila.nombreServicio}</strong>?`;
    const mensajeBoton = `Sí, ${accion}!`;
    const mensajeConfirmacion = `Servicio ${accion}do con éxito!`;

    
    swall.fire({
      html: pregunta,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: mensajeBoton,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.cambiarEstado(fila.id, esBloqueo).subscribe({
          next: () => {
            this.listadoGeneralServicio(true);
          },
          error: (error) => {
            swall.fire({
              icon: 'error',
              html: "Ocurrio erro al intentar bloquear al servicio",
            });
          },
        });

        swall.fire({
          icon: 'success',
          html: mensajeConfirmacion,
        });
        this.estadoFiltro = false
      }
    });
  }

}
