import { AccessRole } from '../shared/enum/access.roleEnum.js';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email o contrasena incorrectos');
    this.name = 'InvalidCredentialsError';
  }
}

export class NoAccessRoleError extends Error {
  readonly userId: string;

  constructor(userId: string) {
    super('El usuario no esta asociado a un cliente ni a un empleado');
    this.name = 'NoAccessRoleError';
    this.userId = userId;
  }
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super('Se requiere iniciar sesion');
    this.name = 'NotAuthenticatedError';
  }
}

export class ForbiddenRoleError extends Error {
  readonly required: AccessRole[];
  readonly actual: AccessRole;

  constructor(required: AccessRole[], actual: AccessRole) {
    super('No tenes permiso para acceder a este recurso');
    this.name = 'ForbiddenRoleError';
    this.required = required;
    this.actual = actual;
  }
}

export class EmailAlreadyUsedError extends Error {
  readonly email: string;

  constructor(email: string) {
    super('Ya existe un usuario con ese email');
    this.name = 'EmailAlreadyUsedError';
    this.email = email;
  }
}

export class DniAlreadyUsedError extends Error {
  readonly dni: number;

  constructor(dni: number) {
    super('Ya existe un cliente con ese DNI');
    this.name = 'DniAlreadyUsedError';
    this.dni = dni;
  }
}

export class InvalidCurrentPasswordError extends Error {
  constructor() {
    super('La contrasena actual no es correcta');
    this.name = 'InvalidCurrentPasswordError';
  }
}
