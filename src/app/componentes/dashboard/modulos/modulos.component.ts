import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Modulo } from './modulo';
import { ModuloService } from './modulo.service';
import { MatDialog } from '@angular/material/dialog';
import swall from 'sweetalert2';
import { ModalCreacionModulosComponent } from './modal-creacion-modulos/modal-creacion-modulos.component';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements AfterViewInit, OnInit {


  estadoFiltro: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'MODULO', 'SERVICIOS', 'ESTADO', 'ACCIONES'];
  dataSource = new MatTableDataSource<Modulo>;

  constructor(
    private moduloServicio: ModuloService,
    public dialog: MatDialog,
  ) {
  }


  ngOnInit(): void {
    this.listadoGeneralModulos(true);
  }


  listadoGeneralModulos(estado: boolean) {

    return this.moduloServicio.getModulo().subscribe({
      next: res => {

        let filtrado = res.filter(p => p.activo === estado);

        console.log("modulo ", filtrado)
        this.dataSource = new MatTableDataSource(filtrado);
        this.dataSource.paginator = this.paginator;
      },
      error: error => {
        swall.fire({
          icon: 'success',
          html: 'Error en cargar servicios: ' + error,
        });
      }
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

  mostrarInactivos() {

    console.log(this.estadoFiltro)

    if (!this.estadoFiltro) {
      this.listadoGeneralModulos( true );
    } else {
      this.listadoGeneralModulos( false );
    }
  }


  abrirDialogoNuevoModulo() {
    this.dialog.open(ModalCreacionModulosComponent, {
      width:'500px',
    }).afterClosed().subscribe(valor => {
      
      this.listadoGeneralModulos( true );
      
    });
  }

  editarModulo(fila: any) {
    this.dialog.open(ModalCreacionModulosComponent, {
      width:'500px',
      data:fila
    }).afterClosed().subscribe(valor => {

      this.listadoGeneralModulos( true );
      
    });
  }

  cambiarEstadoModulo(fila: any) {

    const esBloqueo = !fila.activo;
    const accion = !esBloqueo ? 'bloquear' : 'habilitar';
    const pregunta = `¿Estás seguro de ${accion} a <strong>${fila.nombre}</strong>?`;
    const mensajeBoton = `Sí, ${accion}!`;
    const mensajeConfirmacion = `Modulo ${accion}do con éxito!`;

  
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
        this.moduloServicio.cambiarEstado(fila.id, esBloqueo).subscribe({
          next: () => {
            this.listadoGeneralModulos(true);
          },
          error: (error) => {
            swall.fire({
              icon: 'error',
              html: "Ocurrio erro al intentar bloquear al modulos",
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
