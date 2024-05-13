import { Modulo } from "../../modulos/modulo";


export interface User {
    id?: number;
    nombre?: string;
    apellido?: string;
    correoElectronico?: string;
    contrasena?: string;
    telefono?: string;
    cedula?: string;
    role?: string;
    estado?: boolean;
    username?: string;
    modulo?: Modulo;
  }
  