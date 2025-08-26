import { Request, Response } from 'express'
import * as workspaceMapService from '../services/workspaceMap.service'
import { WorkspaceMapModel } from '../models/workspaceMap.model'
export async function getAllWorkspacesMap(req: Request, res: Response) {
  try {
    const result = await workspaceMapService.getAllmaps()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getWorkspaceMapById(req: Request, res: Response) {
const mapId = req.params.id;
    const result = await workspaceMapService.getWorkspaceMapById(mapId)
   if(result){
    res.status(200).json(result)
   }
   else{
    res.status(404).json({ error: 'Map not found' })
   }
}
export async function getWorkspaceMapByName(req: Request, res: Response) {
const mapName = req.params.name;
    const result = await workspaceMapService.getWorkspaceMapByName(mapName)
   if(result){
    res.status(200).json(result)
   }
   else{
    res.status(404).json({ error: 'Map not found' })
   }
}

export async function createWorkspaceMap(req: Request, res: Response) {
  try {
    const map = new WorkspaceMapModel(req.body)
    const result = await workspaceMapService.createWorkspaceMap(map)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function updateWorkspaceMap(req: Request, res: Response) {
        const mapId = req.params.id;
        const updatedData = req.body;
        const updatedMap = new WorkspaceMapModel(updatedData);
    console.log('Prepared map data:', JSON.stringify(updatedMap, null, 2));
        const result = await workspaceMapService.updateWorkspaceMap(mapId, updatedMap);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to update user" });
        }
}

   

export async function deleteWorkspaceMap(req: Request, res: Response) {
  try {
    await workspaceMapService.deleteWorkspaceMap(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// export async function filterMap(req: Request, res: Response) {
//   try {
//     const result = await workspaceMapService.filterMap(req.body)
//     res.json(result)
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message })
//   }
// }
