import Swal from "sweetalert2"

export const customSwalError = (error: string, title: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text: error,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: 'green',
  })
}

export const customSwalSuccess = (title: string, text: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Continuar',
    confirmButtonColor: 'green',
  })
}
