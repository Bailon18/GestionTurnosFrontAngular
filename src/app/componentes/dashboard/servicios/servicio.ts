import { SafeResourceUrl } from "@angular/platform-browser";


export interface Servicio {
    id?: number;
    nombreServicio ?: string;
    imagen ?: string | SafeResourceUrl | null
    activo ?: boolean;
    modulos?: null;
}
  