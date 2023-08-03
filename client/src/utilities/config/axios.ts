import axios, { AxiosError } from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Language': 'es'
  }
})

// Agregar un interceptor de respuesta para errores
instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
    switch (error.code) {
      case AxiosError.ERR_NETWORK: error.message = 'Error de conexion'; break;
      // case AxiosError.ERR_BAD_REQUEST: error.message = 'Solicitud desconocida, no se puede procesar'; break;
    }
    // // Personaliza el mensaje de error aquí
    // if (error.response && error.response.data && error.response.data.message) {
    //   error.message = error.response.data.message;
    // } else {

    // }

    return Promise.reject(error);
  }
);






