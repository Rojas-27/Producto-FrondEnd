export interface User {
    username: string;
    password: string;
}

export interface UserResponse {
    message: string;
    token: string;
    nombre: string;
    apellidos: string;
    cveUsuario: string;
    username: string;
    cveRol: number;
    rol: string;
    fechaRegistro: Date;
}