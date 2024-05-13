import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideosService } from '../video.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import swall from 'sweetalert2';
import { VideoSalaEspera } from '../video';

@Component({
  selector: 'app-crear-vvideo',
  templateUrl: './crear-vvideo.component.html',
  styleUrls: ['./crear-vvideo.component.css']
})
export class CrearVvideoComponent {

  videoForm: FormGroup
  titulo: string = "Nuevo Video";
  tituloBoton:string ="Guardar"
  banVideo: boolean = false;
  videoSegura: SafeUrl;
  videonuevo: VideoSalaEspera;
  datoeditVideo: any;
  videoServicioEditado: SafeResourceUrl | string | ArrayBuffer | null;

  @ViewChild('videoInputFile', { static: false }) videoInputFile?: ElementRef;


  constructor(private formbuilder: FormBuilder,
            private videoService: VideosService,
            @Inject(MAT_DIALOG_DATA) public datoedit : any,
            private sanitizer: DomSanitizer,
            private cdr: ChangeDetectorRef,
            private dialog : MatDialogRef<CrearVvideoComponent>)
          {}

  ngOnInit(): void {

    this.videoForm = this.formbuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      seleccionado: [false,Validators.required],
      video: ['', Validators.required],
    })


    if(this.datoedit){

      this.videoService.buscarVideoPorId(this.datoedit.id).subscribe(u =>
        {

          this.datoeditVideo = u;

          this.videoForm.controls['id'].setValue(u.id)
          this.videoForm.controls['nombre'].setValue(u.nombre);
          this.videoForm.controls['seleccionado'].setValue(u.seleccionado);
         
          this.videoServicioEditado = u.video; 

          const imagenBase64 = 'data:video/mp4;base64,' + u.video;

          if(imagenBase64){
            this.banImagenprev()
          }
          this.videoSegura = this.sanitizer.bypassSecurityTrustUrl(imagenBase64);
        })

      this.titulo = "Editar Video";
      this.tituloBoton = "Actualizar";

    }
  }


  banImagenprev() {

    if (this.videoForm != null) {
      this.banVideo = true;
      this.videoForm.controls['video'].setErrors(null);
    }
  }

  mostrarVistaPrevia(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.videoSegura = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }


  refreshVideo(){
    return this.videoSegura
  }


  guardarVideo(){

    if (this.videoForm.valid) {
  
      let mensaje = 'Video creada con exito!';
      const formData = new FormData();

      const videoarchivo = this.videoInputFile?.nativeElement.files[0];

      this.videonuevo = {
        nombre: this.videoForm.value.nombre,
        seleccionado: this.videoForm.value.seleccionado,
        video: null
      }

      if (this.datoeditVideo != null) {
        mensaje = 'Video actualizado correctamente!';
        this.videonuevo.id = this.videoForm.value.id;

        if (videoarchivo == null) {

        } else {
          formData.append('videoarchivo', this.videoInputFile?.nativeElement.files[0]);
          
        }
      } else {
        formData.append('videoarchivo', videoarchivo);
      }

      formData.append(
        'video',
        new Blob([JSON.stringify(this.videonuevo)], {
          type: 'application/json',
        })
      );

      if (this.datoedit) {
        this.videoService.actualizarVideo(this.videonuevo.id, formData).subscribe({
          next: () => {
            this.dialog.close()
            this.mostrarmensaje('Video actualizado con exito!', 'success')
          },
          error: (er) => {
            this.mostrarmensaje(er, 'error')
          }
        })
      } else {

        this.videoService.guardarVideo(formData).subscribe({
          next: () => {
            this.dialog.close()
            this.mostrarmensaje('Video creada con exito!', 'success')
          },
          error: (er) => {
            this.mostrarmensaje(er, 'error')
          }
        })
      }
    }

  }

  actualizarVideo(){


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


  isValidField(field: string): boolean | null {
    return (
      this.videoForm.controls[field].errors &&
      this.videoForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.videoForm.controls[field]) return null;

    const errors = this.videoForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        
        case 'required':
          return `${field} es requerido`;
        
      }
    }
    return null;
  }


}
