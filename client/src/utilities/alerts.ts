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

export const customSwalSuccess = (title: string, text: string, html?: string | HTMLElement) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    html,
    confirmButtonText: 'Continuar',
    confirmButtonColor: 'green',
  })
}
