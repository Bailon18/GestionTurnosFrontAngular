import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User } from './model/usuario';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { UsuarioService } from './services/usuario.service';
import {MatDialog} from '@angular/material/dialog';
// import { CrearComponent } from './paginas/crear.component';
import swall from 'sweetalert2';
import { CrearComponent } from './paginas/crear.component';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls:['./usuario.component.css']
})
export class UsuarioComponent implements AfterViewInit , OnInit{
  
  estadoFiltro:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'NOMBRE Y APELLIDOS', 'CORREO', 'ESTADO', 'ROL','ACCIONES'];
  dataSource = new MatTableDataSource<User>;

  constructor(
    private servicio:UsuarioService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.listarUsuarios();
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

  listarUsuarios(){
    return this.servicio.getUsuarios().subscribe(
      {next: res => {
        let filtrado = res.filter(u => u.estado == true)
        this.dataSource = new MatTableDataSource(filtrado)
        this.dataSource.paginator = this.paginator;
        },
        error: error => {
   
        }
      }
    )
  }

  cargarUsuario(){
    return this.servicio.getUsuarios();
  }
  
  abrirDialogoNuevoUsuario() {
    this.dialog.open(CrearComponent, {
         width:'470px',
     }).afterClosed().subscribe(valor =>{
        if (valor === 'guardar') {
          this.listarUsuarios();
       }
    });
  }

  editarUsuario(fila: any){
    this.dialog.open(CrearComponent,{
      width:'470px',
      data:fila
    }).afterClosed().subscribe(valor =>{
      if (valor === 'actualizar') {
        this.listarUsuarios();
      }
    });
  }

  bloquearUsuario(fila: any): void {

    const esBloqueo = !fila.estado;
    const accion = !esBloqueo ? 'bloquear' : 'habilitar';
    const pregunta = `¿Estás seguro de ${accion} a <strong>${fila.nombre}</strong>?`;
    const mensajeBoton = `Sí, ${accion}!`;
    const mensajeConfirmacion = `Usuario ${accion}do con éxito!`;

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
        this.servicio.cambiarEstado(fila.id, esBloqueo).subscribe({
          next: (res) => {
            this.listarUsuarios();
          },
          error: (error) => {
            console.error('Ocurrió un error', error);
          },
        });

        swall.fire({
          icon: 'success',
          html: mensajeConfirmacion,
        });
      }
    });
  }


  mostrarInactivos(){

    if(this.estadoFiltro){

    this.servicio.getUsuarios().subscribe(
      {next: res => {
        let filtrado = res.filter(u => u.estado==false)
        this.dataSource = new MatTableDataSource(filtrado)
        this.dataSource.paginator = this.paginator;
        },
        error: error => {

        }
      }
    )
      
    }else{
      this.listarUsuarios();
      
    }
  }

}


