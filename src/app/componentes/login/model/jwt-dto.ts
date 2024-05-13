import { Modulo } from "../../dashboard/modulos/modulo";


// export class JwtDTO {
//     token?: string;
//     type?: string;
//     nombreUsuario?: string;
//     authorities?: string[];
//     usuarioId? : string;
// }


export interface JwtDTO {
    token: string;
    bearer: string;
    nombreUsuario: string;
    authorities: string[];
    usuarioId: number;
    modulo?: Modulo;
  }