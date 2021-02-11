import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { FormActionData } from '../models/form-action-data';
import { ToastrService } from 'ngx-toastr';
import { PackageJob } from '../models/package';
import { of } from 'rxjs';
import { AppData } from '../models/app-data';

@Injectable({
  providedIn: 'root'
})

export class IgnatiusService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
  }

  deleteData(formActionData: FormActionData): Observable<Object> {
    const url = '/api/formaction/deleteobject';
    return this.http.request('delete', url, { body: formActionData });
  }

  putData(formActionData: FormActionData): Observable<Object> {
    const url = '/api/formaction/putdata';
    return this.http.put(url, formActionData);
  }

  queryReport(query: Object): Observable<Object[]> {
    const url = '/api/report/queryreport';
    return this.http.post<Object[]>(url, query)
      .pipe(
        catchError(() => {
          console.log(`Error loading data in resolve for request with body: ${JSON.stringify(query, null, 2)}`);
          return of(new Array<Object>());
        })
      );
  }

  getReportColumns(appData: AppData, tableId: number, reportId: number): Observable<Object[]> {
    const url = `/api/report/getreportcolumns?tableId=${tableId}&id=${reportId}`;
    return this.http.get<Object[]>(url)
      .pipe(
        catchError(() => {
          console.log(`Error getting report fields. Table ${tableId}. Report ${reportId}.`);
          return of(new Array<Object>());
        }),
        map(rawData => {
          rawData.forEach(data => {
            data["ColumnDisplayName"] = (data["Name"] as string).split(" - ")[1];
          })
          return appData.removeReportDataPrefix(rawData);
        })
      );
  }

  postPackage(query: Object): Observable<Object> {
    const url = '/api/pdfjob';
    return this.http.post(url, query);
  }

  putPackage(query: PackageJob): Observable<Object> {
    const url = '/api/pdfjob';
    return this.http.put(url, query);
  }

  postData(query: Object): Observable<Object> {
    const url = '/api/formaction/postdata';
    return this.http.post(url, query);
  }

  getPackageJob(id: String, appId: string, documentType: string): Observable<Object[]> {
    const url = '/api/pdfjob/?parentId=' + id + '&applicationId=' + appId + '&DocumentType=' + documentType;
    return this.http.get<Object[]>(url);
  }

  getDropdownValues(id: String): Observable<Object[]> {
    const url = '/api/field/getdropdownvalues?id=' + id;
    return this.http.get<Object[]>(url)
      .pipe(
        catchError(() => {
          console.log(`Error getting drop down values for field with id ${id}`);
          return of(new Array<Object>());
        })
      );
  }

  getFileContents({ url }: { url: string; }): Observable<Blob> {

    return this.http.get<Blob>(
      url,
      { responseType: 'blob' as 'json' }
    );

  }

  downloadFile(
    tableId: Number,
    recordId: Number,
    fieldId: Number,
    fileName: string) {
    const url = `/api/formaction/downloadfile?tableId=${tableId}&recordId=${recordId}&fieldId=${fieldId}&fileName=${fileName}`;
    this.http.get(
      url,
      { responseType: 'blob' })
      .subscribe(data => {
        let blob = new Blob([data]);

        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();

      }, () => {
        this.toastr.error("Unable to download file", "Error")
      });
  }

  getTableFields(tableId: number): Observable<Object[]> {
    return this.http.get<Object[]>(
      '/api/field/getbytableid?id=' + tableId
    )
      .pipe(
        catchError(
          () => {
            console.log(`Failed to get fields for table ${tableId}`);
            return of(new Array<Object>());
          }
        )
      );
  }

  getQueryReportObservable(appData: AppData, requestBody: object) {
    return this.queryReport(requestBody)
      .pipe(
        map(rawData => {
          return appData.removeReportDataPrefix(rawData);
        })
      )
  }

  getQueryReportObservables(appData: AppData, requestBodies: Array<any>): Array<Observable<Object[]>> {
    let observables = new Array<Observable<Object[]>>();

    requestBodies.forEach(rb => {
      observables.push(this.queryReport(rb)
        .pipe(
          map(rawData => {
            return appData.removeReportDataPrefix(rawData);
          })
        ));
    })

    return observables;
  }

  getDropDownValueObservables(fieldIds: Array<String>): Array<Observable<Object[]>> {
    let observables = new Array<Observable<Object[]>>();

    fieldIds.forEach(fieldId => {
      observables.push(this.getDropdownValues(fieldId)
        .pipe(
          map(rawData => {
            return (rawData as Object[]).filter((d: any) => d.value);
          })
        ));
    })

    return observables;
  }

  getConditionPostBody(
    targetTableId: any,
    conditionFieldId: any,
    conditionValue: any): any {
    return {
      "ApplicationTableId": targetTableId,
      "ConditionGroups":
        [
          {
            "Type": "all",
            "Conditions": [
              {
                "ConditionField": {
                  "Id": conditionFieldId
                },
                "OperationType": "is equal",
                "Value": conditionValue
              }
            ]
          }
        ]
    };
  }

  getConditionReportBody(
    reportId: any,
    conditionFieldId: any,
    conditionValue: any): any {
    return {
      "ReportId": reportId,
      "ConditionGroups":
        [
          {
            "Type": "all",
            "Conditions": [
              {
                "ConditionField": {
                  "Id": conditionFieldId
                },
                "OperationType": "is equal",
                "Value": conditionValue
              }
            ]
          }
        ]
    };
  }


  getUserAccessDetails(id) {
    const url = '/api/roles/getapplicationrole?id=' + id;
    return this.http.get<Object[]>(url)
      .pipe(
        catchError(() => {
          console.log(`Error getting drop down values for field with id ${id}`);
          return of(new Array<Object>());
        })
      );
  }

  getTargetTableObservable(
    appData: AppData,
    recordId: string,
    targetTableId: number,
    conditionFieldId: number): Observable<Object[]> {
    if (recordId) {
      return this.getQueryReportObservables(
        appData,
        [
          this.getConditionPostBody(
            targetTableId,
            conditionFieldId,
            recordId)
        ]
      )[0];
    }
    else {
      return of(new Array<Object>());
    }
  }

  getTargetReportObservable(
    appData: AppData,
    recordId: number,
    reportId: number,
    conditionFieldId: number): Observable<Object[]> {
    if (recordId) {
      return this.getQueryReportObservables(
        appData,
        [
          this.getConditionReportBody(
            reportId,
            conditionFieldId,
            recordId)
        ]
      )[0];
    }
    else {
      return of(new Array<Object>());
    }
  }

  addConditionGroup(
    documentsPostBody: any,
    conditionFieldId: any,
    conditionValue: any) {
    (documentsPostBody["ConditionGroups"] as Array<any>)
      .push({
        "Type": "all",
        "Conditions": [
          {
            "ConditionField": {
              "Id": conditionFieldId
            },
            "OperationType": "is equal",
            "Value": conditionValue
          }
        ]
      });
  }

  checkQueryParams(invalidParams: Map<string, string>) {
    if (invalidParams.size > 0) {
      let messages = new Array<string>();
      invalidParams.forEach((value, key) => {
        messages.push(`${key}: ${value}`);
      });
      this.toastr.error(messages.join(", "), "Invalid Query Parameters");
    }
  }

  getRecordsWithPropVal(records: any[], property: string, value: string) {
    return records.filter(r => {
      return r[property] as string === value;
    });
  }
}
