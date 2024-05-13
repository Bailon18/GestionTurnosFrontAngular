import { Component, OnInit, ViewChild } from '@angular/core';
import { Atencion } from '../atencion-cola/atenciones';
import { Modulo } from '../modulos/modulo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { AtencionesService } from '../atencion-cola/atenciones.service';
import { MatTableDataSource } from '@angular/material/table';
import { ModuloService } from '../modulos/modulo.service';
import swall from 'sweetalert2';


import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable'; 

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit{

  atenciones : Atencion[];
  atencionesreporte : Atencion[];
  fechaInicio: Date;
  fechaFin: Date;
  modulos: Modulo[] = [];
  reportForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private atencionService: AtencionesService,
    private formbuilder: FormBuilder,
    private moduloServicio: ModuloService,
  ) { }

  columnas: string[] = ['ID', 'CLIENTE', 'TICKET', 'FECHA INICIO', 'FECHA FIN'];
  dataSource = new MatTableDataSource<Atencion>;

  ngOnInit(): void {

    this.reportForm = this.formbuilder.group({
      fechainicio: ['', Validators.required], 
      fechafinal: ['', Validators.required],
      checktodos: [false],
      modulo: ['', Validators.required],
    });

    this.listadoGeneralModulos(true);
    this.obtenerAtenciones()
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
  }

  isValidField(field: string): boolean | null {
    return (
      this.reportForm.controls[field].errors &&
      this.reportForm.controls[field].touched
    );
  }


  getFieldError(field: string): string | null {
    if (!this.reportForm.controls[field]) return null;

    const errors = this.reportForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;
        case 'socioNotEncontrado':
          return `No se encontro socio`;
        
      }
    }
    return null;
  }

  listadoGeneralModulos(estado: boolean) {

    return this.moduloServicio.getModulo().subscribe({
      next: res => {
        let filtrado = res.filter(p => p.activo === estado);
        this.modulos = filtrado
      },
      error: error => {
        swall.fire({
          icon: 'success',
          html: 'Error en cargar servicios: ' + error,
        });
      }
    });
  }

  obtenerAtenciones(): void {
    this.atencionService.listarAtenciones().subscribe(
      atenciones => {
        this.atenciones = atenciones;
        console.log("atenciones ", this.atenciones)
      },
      error => {
        console.error('Error al obtener las atenciones:', error);
      }
    );
  }


  validarcampobusqueda(){
    this.reportForm.get('checktodos')?.setValue(false);
    this.reportForm.get('modulo')?.disable();
  }

  validarcampocheck(): void {
    
    this.reportForm.get('modulo')?.setValue('');
    const isChecked = this.reportForm.get('checktodos')?.value;
    if (!isChecked) {
      this.reportForm.get('modulo')?.setValidators(Validators.required);
      this.reportForm.get('modulo')?.updateValueAndValidity();
      this.reportForm.get('modulo')?.enable();
    }else{
      this.reportForm.get('modulo')?.setErrors(null);
      this.reportForm.get('modulo')?.disable();
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    const data = [];

    if(this.atencionesreporte){

        this.atencionesreporte.forEach(fila => {
          const rowData = [
              fila.id,
              `${fila.ticket.cliente.nombres} ${fila.ticket.cliente.apellidoPaterno}`,
              fila.ticket.numeroTicket,
              new Date(fila.fechaHoraInicio).toLocaleString(),
              fila.fechaHoraFin ? new Date(fila.fechaHoraFin).toLocaleString() : ''
          ];
          data.push(rowData);
      });

      // Agregar el título encima de la tabla
      const titulo = 'Reporte de atenciones';
      const tituloX = doc.internal.pageSize.getWidth() / 2; 
      const tituloY = 10; 
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); 
      doc.text(titulo, tituloX, tituloY, { align: 'center' });

      autoTable(doc, {
          head: [['Id', 'Cliente', 'Ticket', 'Fecha y hora inicio', 'Fecha y hora final']],
          body: data
      });

      doc.save('reporte_atenciones.pdf');
    }else{
      swall.fire({
        html: 'Realiza el filtro para poder descargar el reporte',
        icon: 'error',
        confirmButtonColor: '#d80227',
      });

    }

}



  buscarconsulta(): void {


      const fechaInicio = this.reportForm.get('fechainicio')?.value;
      const fechaFin = this.reportForm.get('fechafinal')?.value;
      const moduloId = this.reportForm.get('modulo')?.value;
      const isChecked = this.reportForm.get('checktodos')?.value;

      const fechaInicioFormateada = this.formatDate(fechaInicio);
      const fechaFinFormateada = this.formatDate(fechaFin);


      if (isChecked) {
        // Si el checkbox está seleccionado, busca todas las atenciones entre las fechas dadas
        // sin importar el módulo
        this.atencionService.listarAtenciones().subscribe(
            atenciones => {
              this.atenciones = atenciones.filter(
                atencion => {
                    const fechaAtencionFormateadaInicio = this.formatDate(new Date(atencion.fechaHoraInicio));
                    const fechaAtencionFormateadaFinal = atencion.fechaHoraFin ? 
                        this.formatDate(new Date(atencion.fechaHoraFin)) : null; // Verificar si fechaHoraFin es null


                    return fechaAtencionFormateadaInicio >= fechaInicioFormateada && 
                    fechaAtencionFormateadaFinal && fechaAtencionFormateadaFinal <= fechaFinFormateada;
                }

                
            );

            this.dataSource = new MatTableDataSource(this.atenciones );
            this.dataSource.paginator = this.paginator;
            
            this.atencionesreporte = this.atenciones
            console.log('filtro 01:', this.atenciones);
            },
            error => {
                console.error('Error al obtener las atenciones:', error);
            }
        );

        
    } else {
        // Si el checkbox no está seleccionado, busca las atenciones entre las fechas dadas
        // y con el módulo especificado
        this.atencionService.listarAtenciones().subscribe(
            atenciones => {
                this.atenciones = atenciones.filter(
                    atencion => {

                      const fechaAtencionFormateadaInicio = this.formatDate(new Date(atencion.fechaHoraInicio));
                      const fechaAtencionFormateadaFinal = atencion.fechaHoraFin ? 
                          this.formatDate(new Date(atencion.fechaHoraFin)) : null; // Verificar si fechaHoraFin es null

                    return fechaAtencionFormateadaInicio >= fechaInicioFormateada && 
                    fechaAtencionFormateadaFinal && fechaAtencionFormateadaFinal <= fechaFinFormateada &&
                               atencion.modulo.id === moduloId;
                    }
                );
                this.dataSource = new MatTableDataSource(this.atenciones );
                this.dataSource.paginator = this.paginator;
                this.atencionesreporte = this.atenciones
            },
            error => {
                console.error('Error al obtener las atenciones:', error);
            }
        );
    }
    
  }

  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

}
