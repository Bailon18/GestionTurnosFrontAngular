import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import swall from 'sweetalert2';
import { ModuloService } from '../../modulos/modulo.service';
import { Modulo } from '../../modulos/modulo';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  usuarioForm: FormGroup
  titulo: string = "Nuevo Usuario";
  tituloBoton:string ="Guardar"
  correoOriginal?: string;
  cedulaOriginal?: string;
  usernameOriginal?: string;
  modulos: Modulo[] = [];
  roles: string[] = [];


  constructor(private formbuilder: FormBuilder,
            private servicio: UsuarioService,
            @Inject(MAT_DIALOG_DATA) public datoedit : any,
            private dialog : MatDialogRef<CrearComponent>,
            private moduloService: ModuloService,
            private usuarioService: UsuarioService
            )
          {}

  ngOnInit(): void {

    this.obtenerListadoModulo();
  

    this.usuarioForm = this.formbuilder.group({
      id: [''],
      nombre: ['', [Validators.required, this.validarTexto.bind(this)]],
      apellido: ['', [Validators.required, this.validarTexto.bind(this)]],
      telefono: ['', [Validators.required, this.validarNumerico.bind(this),  this.validarLongitud(9)]],
      cedula: ['', [Validators.required, this.validarNumerico.bind(this),  this.validarLongitud(8)]],
      contrasena: ['',[Validators.required, Validators.minLength(5)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      estado: [true, Validators.required],
      role: ['Administrador'],
      username:['',[Validators.required]],
      modulo: ['',[Validators.required]]
    })


    if(this.datoedit){

      this.servicio.buscarUsuario(this.datoedit.id).subscribe(  u =>
        {
        
          this.usuarioForm.controls['id'].setValue(u.id)
          this.usuarioForm.controls['nombre'].setValue(u.nombre);
          this.usuarioForm.controls['apellido'].setValue(u.apellido);
          this.usuarioForm.controls['telefono'].setValue(u.telefono);
          this.usuarioForm.controls['cedula'].setValue(u.cedula);
          this.usuarioForm.controls['contrasena'].setValue(u.contrasena);
          this.usuarioForm.controls['correoElectronico'].setValue(u.correoElectronico);
          this.usuarioForm.controls['estado'].setValue(u.estado);
          this.usuarioForm.controls['role'].setValue(u.role);
          this.usuarioForm.controls['username'].setValue(u.username);
          this.usuarioForm.controls['modulo'].setValue(u.modulo.id)

          this.correoOriginal = u.correoElectronico;
          this.cedulaOriginal = u.cedula;
          this.usernameOriginal = u.username;
          this.usuarioForm.get('correoElectronico')?.setValue(u.correoElectronico);
        })

      this.titulo = "Editar Usuario";
      this.tituloBoton = "Actualizar";

    }
  }

  obtenerListadoModulo(): void {
    this.moduloService.getModulo().subscribe({
      next: (data: Modulo[]) => {

        let filtrado = data.filter(p => p.activo === true);
        this.modulos = filtrado;
      },
      error: (error) => {
      }
    });
  }

  guardarUsuario() {

    if (!this.datoedit) {
        if (this.usuarioForm.valid) {

            const user = {

                nombre: this.usuarioForm.value['nombre'],
                apellido: this.usuarioForm.value['apellido'],
                telefono: this.usuarioForm.value['telefono'],
                cedula: this.usuarioForm.value['cedula'],
                contrasena: this.usuarioForm.value['contrasena'],
                correoElectronico: this.usuarioForm.value['correoElectronico'],
                estado: this.usuarioForm.value['estado'],
                role: this.usuarioForm.value['role'],
                username: this.usuarioForm.value['username'],
                modulo: {
                  id: this.usuarioForm.value['modulo']
                } 
            };

      
            this.servicio.guardarUsuarioServi(user).subscribe(() => {
                this.dialog.close("guardar")
                swall.fire({
                    icon: 'success',
                    confirmButtonColor: '#0275d8',
                    html: `Se registró correctamente al usuario: <strong>${user.nombre}</strong>`,
                });
            });
        }
    } else {
        this.actualizarUsuario();
    }
}

  actualizarUsuario(){

    const user = {

      id: this.usuarioForm.value['id'],
      nombre: this.usuarioForm.value['nombre'],
      apellido: this.usuarioForm.value['apellido'],
      telefono: this.usuarioForm.value['telefono'],
      cedula: this.usuarioForm.value['cedula'],
      contrasena: this.usuarioForm.value['contrasena'],
      correoElectronico: this.usuarioForm.value['correoElectronico'],
      estado: this.usuarioForm.value['estado'],
      role: this.usuarioForm.value['role'],
      username: this.usuarioForm.value['username'],
      modulo: {
        id: this.usuarioForm.value['modulo']
      } 
  };

    this.servicio.guardarUsuarioServi(user).subscribe( () => {
      this.dialog.close("actualizar");
      swall.fire({
        icon: 'success',
        confirmButtonColor:'#0275d8',
        html:  `Se actualizo correctamente al usuario:  <strong>${this.usuarioForm.value['nombre']}</strong>`,
      })

    })

  }

  
  validarcorreo(event: any) {
    const correoFormControl = this.usuarioForm.get('correoElectronico');
  
    if (correoFormControl?.valid) {
      const nuevoCorreo = (event.target as HTMLInputElement).value;
  
      if (nuevoCorreo !== this.correoOriginal) {
        this.servicio.validarcorreo(nuevoCorreo).subscribe( (res: boolean) => {
          if (res) {
            correoFormControl.setErrors({ correoInvalid: 'Correo ya está registrado' });
          } else {
            correoFormControl.setErrors(null);
          }
        });
      }
    }
  }

  validarCedula(event: any) {
    const cedulaFormControl = this.usuarioForm.get('cedula');
  
    if (cedulaFormControl?.valid) {
      const cedulaNueva = (event.target as HTMLInputElement).value;
  
      if (cedulaNueva !== this.cedulaOriginal) {
        this.servicio.validarCedula(cedulaNueva).subscribe( (res: boolean) => {
          if (res) {
            cedulaFormControl.setErrors({ cedulaInvalid: 'Cedula ya está registrado' });
          } else {
            cedulaFormControl.setErrors(null);
          }
        });
      }
    }
  }

  validarUsername(event: any) {
    const usernameFormControl = this.usuarioForm.get('username');
  
    if (usernameFormControl?.valid) {
      const nuevoUsername = (event.target as HTMLInputElement).value;
  
      if (nuevoUsername !== this.usernameOriginal) {
        this.servicio.validarUsername(nuevoUsername).subscribe( (res: boolean) => {
          if (res) {
            usernameFormControl.setErrors({ usernameInvalid: 'Username ya está registrado' });
          } else {
            usernameFormControl.setErrors(null);
          }
        });
      }
    }
  }

  validarLongitud(longitud: number) {
    return (control: FormControl) => {
      const valor = control.value;
      if (valor && valor.toString().length === longitud) {
        return null; 
      } else {
        return { longitudIncorrecta: true }; 
      }
    };
  }

  validarNumerico(control: FormControl): { [key: string]: any } | null {
    const esNumerico = /^[0-9]+$/.test(control.value);

    if(esNumerico){
      return null
    }else{
      return { pattern2: true }; 
    }

  }

  validarTexto(control: FormControl): { [key: string]: any } | null {
    const esTextoValido = /^[a-zA-Z\s]*$/.test(control.value);
  
    if (esTextoValido) {
      return null; 
    } else {
      return { patronTextoInvalido: true }; 
    }
  }
  
  
  isValidField(field: string): boolean | null {
    return (
      this.usuarioForm.controls[field].errors &&
      this.usuarioForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.usuarioForm.controls[field]) return null;

    const errors = this.usuarioForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        
        case 'required':
          return `${field} es requerido`;
        
        case 'pattern2':
          return `Tiene que ser númerico `;
        
        case 'patronTextoInvalido':
          return `Tiene que ser texto `;

        case 'longitudIncorrecta':
          return `Longitug incorrecto.`;
  
        case 'email':
          return `${field} no tiene el formato correcto`;

        case 'minlength':
            const minLength = errors['minlength']?.requiredLength;
            return `debe tener al menos ${minLength} digitos`;
          
        case 'maxlength':
              const maxLength = errors['maxlength']?.requiredLength;
              return `debe tener con maximo ${maxLength} digitos`;

        case 'correoInvalid':
            return `Correo ya esta registrado`;

        case 'cedulaInvalid':
            return `Cedula ya esta registrado`;

        case 'usernameInvalid':
          return `Username ya esta registrado`;
      }
    }
    return null;
  }
}
