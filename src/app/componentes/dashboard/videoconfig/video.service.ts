import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/helpers';
import { VideoSalaEspera } from './video';




@Injectable({
  providedIn: 'root'
})
export class VideosService {


  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient) { }

  listarVideos(): Observable<VideoSalaEspera[]> {
    return this.http.get<VideoSalaEspera[]>(`${baseUrl}/videos`);
  }


  eliminarVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/videos/${id}`);
  }

  buscarVideoPorId(id: number): Observable<VideoSalaEspera> {
    return this.http.get<VideoSalaEspera>(`${baseUrl}/videos/${id}`);
  }

  actualizarVideo(id: number, dato: FormData): Observable<any> {
    return this.http.put(`${baseUrl}/videos/${id}`, dato);
  }

  guardarVideo(dato: FormData): Observable<any> {
    return this.http.post(`${baseUrl}/videos`, dato);
  }

  seleccionarVideo(videoId: number): Observable<string> {
    return this.http.put<string>(`${baseUrl}/videos/seleccionar/${videoId}`, {});
  }

  buscarVideoSeleccionado(): Observable<VideoSalaEspera> {
    return this.http.get<VideoSalaEspera>(`${baseUrl}/videos/seleccionado`);
  }

}
