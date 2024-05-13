import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Modulo } from '../modulo';
import { ModuloService } from '../modulo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosService } from '../../servicios/servicios.service';
import { DomSanitizer } from '@angular/platform-browser';
import swall from 'sweetalert2';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-modal-creacion-modulos',
  templateUrl: './modal-creacion-modulos.component.html',
  styleUrls: ['./modal-creacion-modulos.component.css']
})
export class ModalCreacionModulosComponent implements OnInit {

  moduloForm: FormGroup;
  titulo: string = "Nuevo Modulo";
  tituloBoton: string = "Guardar"
  nuevoModulo?: Modulo;
  datoeditmodulo: any;
  servicios: Servicio[] = []
  serviciosSeleccionados: number[] = [];

  constructor(private formbuilder: FormBuilder,
    private moduloService: ModuloService,
    @Inject(MAT_DIALOG_DATA) public datoedit: any,
    private servicioService: ServiciosService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialogRef<ModalCreacionModulosComponent>) { }


    ngOnInit(): void {

      this.listadoGeneralServicio(true)

      this.moduloForm = this.formbuilder.group({
        id: [''],
        nombre: ['', Validators.required],
        activo: ['true', Validators.required],
      });


      if (this.datoedit) {

        this.moduloService.buscarModuloId(this.datoedit.id).subscribe({
          next: (resp) => {
  
            this.datoeditmodulo = resp;


            resp.servicios.forEach(servicio => {
              if (!this.serviciosSeleccionados.includes(servicio.id)) {
                this.serviciosSeleccionados.push(servicio.id);
              }
            });


      
            this.moduloForm.patchValue({
              id: resp.id,
              nombre: resp.nombre,
              activo: resp.activo,

            });
  
            this.titulo = "Editar Modulo";
            this.tituloBoton = "Actualizar MOdulo"
  
          },
          error: (error) => {
            console.error('Error al buscar el modulo:', error);
          }
        });
      }
    
    }

    isSelected(id: number): boolean {
      return this.serviciosSeleccionados.includes(id);
    }
    

    isValidField(field: string): boolean | null {
      return (
        this.moduloForm.controls[field].errors &&
        this.moduloForm.controls[field].touched
      );
    }
  
    getFieldError(field: string): string | null {
      if (!this.moduloForm.controls[field]) return null;
  
      const errors = this.moduloForm.controls[field].errors || {};
  
      for (const key of Object.keys(errors)) {
        switch (key) {
          case 'required':
            return `${field} es requerido`;
        }
      }
  
      return null;
    }
  
    listadoGeneralServicio(estado: boolean) {

      return this.servicioService.listarServicios().subscribe({
        next: res => {
  
          let filtrado = res.filter(p => p.activo === estado);
          filtrado.forEach(item => {
            item.imagen = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + item.imagen);
          });

          this.servicios = filtrado;
        },
        error: error => {
          swall.fire({
            icon: 'success',
            html: 'Error en cargar productos: ' + error,
          });
        }
      });
    }

    toggleServicioSeleccionado(id: number) {
      const index = this.serviciosSeleccionados.indexOf(id);
      if (index === -1) {
        this.serviciosSeleccionados.push(id);
      } else {
        this.serviciosSeleccionados.splice(index, 1);
      }
    }


    guardarModulo() {

      const moduloFormValue = this.moduloForm.value;
      
      if (this.serviciosSeleccionados.length === 0) {

        swall.fire({
          icon: 'error',
          html: 'Oops... selecciona un servicio',
          text: 'Debes seleccionar al menos un servicio antes de guardar.'
        });
        return; 
      }
      
      const modulo : Modulo= {
        nombre: moduloFormValue.nombre,
        activo: moduloFormValue.activo,
        servicios: this.serviciosSeleccionados.map(id => ({ id })) 
      };


      if(this.datoedit == null){ // this.datoedit != null
        this.guardarNuevoModulo(modulo)
      }else{
        modulo.id = moduloFormValue.id
        this.actualizarModulo(modulo)
      }

    }


    guardarNuevoModulo(modulo: any){

  
      this.moduloService.guardarModulo(modulo).subscribe(

        response => {          
          swall.fire({
            icon: 'success',
            title: 'Éxito',
            text: '¡El módulo se ha guardado exitosamente!'
          });
          this.dialog.close()
        },
        error => {
          console.error('Error al guardar el módulo:', error);
          swall.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se produjo un error al guardar el módulo. Por favor, inténtalo de nuevo más tarde.'
          });
        }
      );
    }

    actualizarModulo(modulo: any){


      this.moduloService.actualizarModulo(modulo).subscribe(
        response => {          
          swall.fire({
            icon: 'success',
            title: 'Éxito',
            text: '¡El módulo se ha actualizado exitosamente!'
          });
          this.dialog.close();
        },
        error => {
          swall.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se produjo un error al actualizar el módulo. Por favor, inténtalo de nuevo más tarde.'
          });
        }
      );
    }

    
  
}
