import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideosService } from './video.service';
import { VideoSalaEspera } from './video';
import { CrearVvideoComponent } from './crear-vvideo/crear-vvideo.component';
import { MatDialog } from '@angular/material/dialog';
import swall from 'sweetalert2';

@Component({
  selector: 'app-videoconfig',
  templateUrl: './videoconfig.component.html',
  styleUrls: ['./videoconfig.component.css']
})
export class VideoconfigComponent implements OnInit {
  videos: VideoSalaEspera[] = [];

  constructor(
    private videosService: VideosService,
     private sanitizer: DomSanitizer,
     public dialog: MatDialog
     ) { }

  ngOnInit(): void {
    this.listarVideos();
  }

  listarVideos(): void {
    this.videosService.listarVideos().subscribe(
      response => {
        this.videos = response.map(video => {
          video.video = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + video.video);
          return video;
        });
        
      },
      error => {
        console.error('Error al obtener la lista de videos:', error);
      }
    );
  }


  abrirDialogoNuevoVideo() {
    this.dialog.open(CrearVvideoComponent, {
        width:'500px',
     }).afterClosed().subscribe(valor =>{
        this.listarVideos();
    });
  }

  editarVideo(fila: any){
    this.dialog.open(CrearVvideoComponent,{
      width:'500px',
      data:fila
    }).afterClosed().subscribe(valor =>{
      this.listarVideos();
    });
  }

  seleccionarVideo(fila: any){

      const pregunta = `¿Estás seguro de seleccionar el video <strong>${fila.nombre}</strong>? para la sala de espera?`;
      const mensajeBoton = `Sí, seleccionar!`;
      const mensajeConfirmacion = `Video seleccionado con éxito!`;

      swall.fire({
        html: pregunta,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#0275d8',
        cancelButtonColor: '#9c9c9c',
        confirmButtonText: mensajeBoton,
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {

          this.videosService.seleccionarVideo(fila.id).subscribe({
            next: (res) => {
              this.listarVideos();
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

  eliminarVideo(fila: any): void {

    const pregunta = `¿Estás seguro de eliminara <strong>${fila.nombre}</strong>?`;
    const mensajeBoton = `Sí, eliminar!`;
    const mensajeConfirmacion = `Video eliminado con éxito!`;

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

        this.videosService.eliminarVideo(fila.id).subscribe({
          next: (res) => {
            this.listarVideos();
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

}
