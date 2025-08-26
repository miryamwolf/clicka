
  import {ID,DateISO} from './core';
  export interface WorkspaceMap {
  id?: ID;
  name: string;
  lastUpdated: DateISO;
  }


export interface MapLayout {
  id?: string;
  workspaceMapid: string;
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;
}