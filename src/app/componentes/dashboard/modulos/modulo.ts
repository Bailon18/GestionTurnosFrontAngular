import { Servicio } from "../servicios/servicio";

export interface Modulo {
    id?: number;
    nombre?: string;
    activo?: boolean;
    servicios?: Servicio[]
  }
  