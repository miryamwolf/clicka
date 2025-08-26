import { Request, Response } from 'express';
import {RoomFeatureService} from '../services/roomFeature.service';
import { RoomFeatureModel } from "../models/roomFeature.model";

export class RoomFeatureController {
    private roomFeatureService = new RoomFeatureService();

       async createRoomFeature(req: Request, res: Response)  {
        try {
            console.log('Received request to create feature:', req.body);
            const featureData = req.body;
            console.log('Prepared feature data:', JSON.stringify(featureData, null, 2));
           
           const feature = new RoomFeatureModel(featureData);
           console.log('feature object created:', JSON.stringify(feature, null, 2));
            const result = await this.roomFeatureService.createFeature(feature);
            console.log('BODY?', req.body);
            console.log('HEADERS?', req.headers);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ error: "Failed to create feature" });
            }
            if (!req.body) {
                return res.status(400).json({ error: 'Body is missing!' });
              }
        } catch (error) {
            console.error("Error creating room:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

 async getAllFeatures(req: Request, res: Response){
   const result = await this.roomFeatureService.getAllFeatures();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(500).json({ error: "Failed to fetch feature" });
        }
}


 async updateFeature(req: Request, res: Response){
    console.log('Received request to update feature:', req.body);
    try{
        const featureData = req.body;
        const feature = new RoomFeatureModel(featureData);
        
      const updateFeature=await this.roomFeatureService.updateFeature(req.params.id,feature);
      res.json(updateFeature);
    }
    catch(err){
       res.status(500).json({massage:'err.message'});
    }
}
 async  getFeatureById(req: Request, res: Response){
    try{
        const getFeature=await this.roomFeatureService.getFeatureById(req.params.id);
        res.json(getFeature);
    }
    catch(err){
res.status(500).json({massage:'err.massage'});
    }
}

 async  deleteFeature(req: Request, res: Response) {
    try{
      const deleteFeature=await this.roomFeatureService.deleteFeature(req.params.id);
      res.json(deleteFeature);
    }
    catch(err){
      res.status(500).json({massage:'err.massage'});
    }
}
}