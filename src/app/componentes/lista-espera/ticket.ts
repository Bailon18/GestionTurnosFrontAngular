import { Modulo } from "../dashboard/modulos/modulo";
import { Servicio } from "../dashboard/servicios/servicio";
import { Cliente } from "../generarticket/cliente";

export interface Ticket {
    id?: number;
    numeroTicket?: string;
    fecha?: Date;
    estado?: string;
    cliente?: Cliente;
    servicio?: Servicio;
    modulo?: Modulo;
  }
  