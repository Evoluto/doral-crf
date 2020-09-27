import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExportService {
  constructor() { }
  public exportAsExcelFile(sheerArr: any[], fileName: string): void {

    const WB = XLSX.utils.book_new();

    for (const iterator of sheerArr) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(iterator.sheetData);
      XLSX.utils.book_append_sheet(WB, worksheet, iterator.sheetName);
    }

    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(WB, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}