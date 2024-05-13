import { SafeResourceUrl } from "@angular/platform-browser";

export interface VideoSalaEspera {
    id?: number;
    nombre: string;
    seleccionado: boolean;
    video:  SafeResourceUrl | string | ArrayBuffer | null;
  }
  