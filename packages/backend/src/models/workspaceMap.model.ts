import { WorkspaceMap } from 'shared-types/workspaceMap';
import type{ DateISO, ID, SpaceStatus, WorkspaceType } from "shared-types";



export class WorkspaceMapModel implements WorkspaceMap {
  id?: ID;
  name: string;
  lastUpdated: DateISO;


  constructor(params:{id: ID,name: string, lastUpdated: DateISO}) {
    this.id = params.id || undefined;
    this.name = params.name;
    this.lastUpdated = params.lastUpdated;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      last_updated: this.lastUpdated,
    };
  }
  static fromDatabaseFormat(data: any):WorkspaceMapModel {
    return new WorkspaceMapModel({
      id: data.id,
     name:data.name,
     lastUpdated:data.last_updated
    });
  }
   static fromDatabaseFormatArray(dbDataArray: any[] ): WorkspaceMapModel[] {
        return dbDataArray.map(dbData => WorkspaceMapModel.fromDatabaseFormat(dbData));
    }

}
