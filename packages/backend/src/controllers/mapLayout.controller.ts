import { MapLayoutModel } from "../models/mapLayout.model";
import { Request, Response } from "express";
import * as mapLayoutService from '../services/mapLayout.service'


export async function getAll(req: Request, res: Response) {
  try {
    const result = await mapLayoutService.getAll()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getLayoutById(req: Request, res: Response) {
const layoutId = req.params.id;
    const result = await mapLayoutService.getLayoutById(layoutId)
   if(result){
    res.status(200).json(result)
   }
   else{
    res.status(404).json({ error: 'Map not found' })
   }

   
  
}


export async function createLayout(req: Request, res: Response) {
  try {
    const layout = new MapLayoutModel(req.body);
    const result = await mapLayoutService.createLayout(layout)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
  //  if (result) {
  //           res.status(200).json(result);
  //       } else {
  //           res.status(500).json({ error: "Failed to fetch users" });
        

export async function updateLayout(req: Request, res: Response) {
        const layoutId = req.params.id;
        const updatedData = req.body;
        const updateLayout = new MapLayoutModel(updatedData);
        const result = await mapLayoutService.updateLayout(layoutId, updateLayout);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to update layout" });
        }
}

   

export async function deleteLayout(req: Request, res: Response) {
  try {
    await mapLayoutService.deleteLayout(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}