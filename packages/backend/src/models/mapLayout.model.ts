import { MapLayout } from "shared-types/workspaceMap";

export class MapLayoutModel implements MapLayout {
  id?: string;
  workspaceMapid: string;
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;
  constructor(params: {
    id: string;
    workspaceMapid: string;
    width: number;
    height: number;
    backgroundImage: string;
    scale: number;
    viewBox: string;
  }) {
    this.id = params.id|| undefined;
    this.workspaceMapid = params.workspaceMapid;
    this.width = params.width;
    this.height = params.height;
    this.backgroundImage = params.backgroundImage||undefined;
    this.scale = params.scale;
    this.viewBox = params.viewBox;

  }


  toDatabaseFormat() {
    return {
      workspace_map_id: this.workspaceMapid,
      width: this.width,
      height: this.height,
      background_image: this.backgroundImage,
      scale: this.scale,
      view_box: this.viewBox,
    };
  }
  static fromDatabaseFormat(data: any):MapLayoutModel {
    return new MapLayoutModel({
      id: data.id,
      workspaceMapid: data.workspace_map_id,
      width: data.width,
      height: data.height,
      backgroundImage: data.background_image,
      scale: data.scale,
      viewBox: data.view_box,
    });
  }
   static fromDatabaseFormatArray(dbDataArray: any[] ): MapLayoutModel[] {
        return dbDataArray.map(dbData => MapLayoutModel.fromDatabaseFormat(dbData));
    }
}