import { Ticket } from "../../lista-espera/ticket";
import { Modulo } from "../modulos/modulo";
import { User } from "../usuario/model/usuario";

export interface Atencion {
    id?: number;
    ticket: Ticket;
    user: User;
    modulo: Modulo;
    estado: string;
    fechaHoraInicio?: Date;
    fechaHoraFin?: Date;
  }