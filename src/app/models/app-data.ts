export class AppData {
    constructor(
        public Name: string,
        public DbName: string,
        public Tables: Array<Table>,
        public Users: Array<User>
    ){}

    removeReportDataPrefix(tableData: Object[]): Object[]{
        let stringValuesToRemove = new Array<string>();
        this.Tables.forEach(t => {
            stringValuesToRemove.push(`tbl${t.Id}_`);
        });
        const regEx = new RegExp(stringValuesToRemove.join("|"), 'g');
        const tableDatastring = JSON.stringify(tableData).replace(regEx, "");
        return JSON.parse(tableDatastring);
    }

    getDateHtmlInputFormat(date: string): string{
        return new Date(date).toISOString().split('T')[0];
    }

    getTableRecord(tableDataIsRecord: boolean, tableData: Object[], dataFields: string[]): any{
        if(tableDataIsRecord){
            let record = tableData[0];

            for (let [key, value] of Object.entries(record)) {
                if(dataFields.includes(key)){
                    if (value == null)
                    value = "";
                    if (value) {
                    const stringValue = value as string;
                    record[key] = this.getDateHtmlInputFormat(stringValue);
                    }
                }
            } 

            return record;
            
        }else{
            let output: any = {};
            tableData.forEach(field => {
                output[field["fieldName"]] = null;
            });

            return output;
        }
    }

    getAppItemId(appItem: Array<AppItem>, name: string): number{
		let item = appItem.find(f => f.Name.toUpperCase() === name.toUpperCase());
		if(item){
			return item.Id
		}else{
			console.log(`Unable to find AppItem: ${name}`);
			return undefined;
		}
	}
}

export class Table implements AppItem {
    constructor(
        public Id: number,
        public Name: string,
        public DbName: string,
        public Fields: Array<Field>,
        public Reports: Array<Report>
    ){}
}

export class Field implements AppItem {
    constructor(
        public Id: number,
        public Name: string,
        public DbName: string
    ){}
}

export class Report implements AppItem {
    constructor(
        public Id: number,
        public Name: string
    ){}
}

export class User {
    constructor(
        public Email: string
    ){}
}

export interface AppItem{
    Id: number;
    Name: string;
}
