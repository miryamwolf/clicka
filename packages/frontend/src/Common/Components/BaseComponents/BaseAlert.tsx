import Swal, { SweetAlertIcon } from 'sweetalert2';
interface ShowAlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmText?: string;
}
export const showAlert = ({
  title,
  text = '',
  icon = 'info',
  confirmText = 'אישור',
}: ShowAlertOptions) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: confirmText,
  });
};