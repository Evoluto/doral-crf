

export class MultiselectModel {
  singleSelection: boolean = false;
  idField: string = 'item_id';
  textField: string = 'item_text';
  selectAllText: string = 'Select All';
  unSelectAllText: string = 'UnSelect All';
  itemsShowLimit: number = 5;
  allowSearchFilter: boolean = true;
}
