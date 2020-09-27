export class PopupModel {
  busy: boolean = false;
  title: string;
  modalClass?: any;
  settings: any = {
    size: 'lg',
    centered: true,
    backdrop: true,
    animation: true,
    keyboard: true,
    ariaLabelledBy: 'modal-basic-title'
  }
}
