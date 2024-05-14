import { Injectable } from '@angular/core';
import { VideoSalaEspera } from './componentes/dashboard/videoconfig/video';


@Injectable({
  providedIn: 'root'
})
export class VideoServiciosData {
  private videos: VideoSalaEspera[] = [];

  constructor() { }

  guardarVideos(videos: VideoSalaEspera[]): void {
    this.videos = videos;
  }

  recuperarVideos(): VideoSalaEspera[] {
    return this.videos;
  }
}
