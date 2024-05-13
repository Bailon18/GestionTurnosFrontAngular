import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servicio } from '../servicio';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ServiciosService } from '../servicios.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import swall from 'sweetalert2';

@Component({
  selector: 'app-modal-creacion-servicio',
  templateUrl: './modal-creacion-servicio.component.html',
  styleUrls: ['./modal-creacion-servicio.component.css']
})
export class ModalCreacionServicioComponent implements OnInit {


  @ViewChild('imagenInputFile', { static: false }) imagenInputFile?: ElementRef;


  servicioForm: FormGroup;
  titulo: string = "Nuevo Servicio";
  tituloBoton: string = "Guardar"
  nuevoServicio?: Servicio;
  banImagen: boolean = false;
  datoeditServicio: any;
  imagenSegura: SafeUrl;
  imagenServicioEditado: string | ArrayBuffer | null = null;


  constructor(private formbuilder: FormBuilder,
    private servicioService: ServiciosService,
    private sanitizer: DomSanitizer,

    @Inject(MAT_DIALOG_DATA) public datoedit: any,
    private dialog: MatDialogRef<ModalCreacionServicioComponent>) { }


    ngOnInit(): void {
      
      this.servicioForm = this.formbuilder.group({
        id: [''],
        nombreServicio: ['', Validators.required],
        activo: ['true', Validators.required],
        imagen: ['', Validators.required],
        imagenurl: [''],
      });
  
      if (this.datoedit) {
        this.servicioService.buscarServicioId(this.datoedit.id).subscribe({
          next: (resp) => {
  
            this.datoeditServicio = resp;
          
            this.servicioForm.patchValue({
              id: resp.id,
              nombreServicio: resp.nombreServicio,
              activo: resp.activo
            });
  
            this.imagenServicioEditado = 'data:image/png;base64,' + resp.imagen;
            const imagenBase64 = 'data:image/png;base64,' + resp.imagen;
            this.imagenSegura = this.sanitizer.bypassSecurityTrustUrl(imagenBase64);
  

            this.titulo = "Editar Servicio";
            this.tituloBoton = "Actualizar Servicio"
  
          },
          error: (error) => {
            console.error('Error al buscar el servicio:', error);
          }
        });
      }
    }


    isValidField(field: string): boolean | null {
      return (
        this.servicioForm.controls[field].errors &&
        this.servicioForm.controls[field].touched
      );
    }
  
    getFieldError(field: string): string | null {
      if (!this.servicioForm.controls[field]) return null;
  
      const errors = this.servicioForm.controls[field].errors || {};
  
      for (const key of Object.keys(errors)) {
        switch (key) {
          case 'required':
            return `${field} es requerido`;
        }
      }
  
      return null;
    }
  

    mostrarVistaPrevia(): void {
      const input = this.imagenInputFile?.nativeElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imagenPreview = document.getElementById(
            'imagenPreview'
          ) as HTMLImageElement;
          imagenPreview.src = e.target.result;
          imagenPreview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  
    banImagenprev() {
      if (this.servicioForm != null) {
        this.banImagen = true;
        this.servicioForm.controls['imagen'].setErrors(null);
      }
    }

    guardarServicio() {

      if (this.servicioForm.valid) {
  
        let mensaje = 'Servicio creada con exito!';
        const formData = new FormData();
  
        const imagen = this.imagenInputFile?.nativeElement.files[0];
  
        this.nuevoServicio = {
          nombreServicio: this.servicioForm.value.nombreServicio,
          activo: this.servicioForm.value.activo,
          imagen: null
        }
  
        if (this.datoeditServicio != null) {
          mensaje = 'Plato actualizado correctamente!';
          this.nuevoServicio.id = this.servicioForm.value.id;
  
          if (imagen == null) {
            formData.append('imagen', this.imagenServicioEditado.toString());
          } else {
            formData.append('imagen', imagen);
            
          }
        } else {
          formData.append('imagen', imagen);
        }
  
        formData.append(
          'servicio',
          new Blob([JSON.stringify(this.nuevoServicio)], {
            type: 'application/json',
          })
        );
  
        if (this.datoedit) {
  
          this.servicioService.actualizarServicio(this.datoedit.id, formData).subscribe({
            next: () => {
              this.dialog.close()
              this.mostrarmensaje(mensaje, 'success')
            },
            error: (er) => {
              this.mostrarmensaje(er.error.mensaje, 'error')
            }
          })
        } else {
  
          this.servicioService.guardarServicio(formData).subscribe({
            next: () => {
              this.dialog.close()
              this.mostrarmensaje(mensaje, 'success')
            },
            error: (er) => {
              this.mostrarmensaje(er.error.mensaje, 'error')
            }
          })
        }
      }
    }
  

    mostrarmensaje(mensaje: string, tipo: string) {
      if (tipo == 'success') {
        swall.fire({
          icon: 'success',
          html: mensaje,
        });
      } else {
        swall.fire({
          icon: 'error',
          html: mensaje,
        });
      }
    }
}
