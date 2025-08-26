import  {OccupancyTrendService} from '../services/occupancyTrend.service';
import { Request,Response } from "express";
import {OccupancyTrendModel}from '../models/occupancyTrend.model'

const occupancyTrendService = new OccupancyTrendService();
//כדי לראות את תמונת המצב
export async function  getAllTrends(req:any, res:any) {
    try {
      const trends = await occupancyTrendService.getAllTrends();
      res.json(trends);
    } catch (err:any) {
      console.error(err); // חשוב גם ללוג
      res.status(500).json({
          message: err.message,
          stack: err.stack // אופציונלי – למעקב בזמן פיתוח
      });
  }
  }
     export async function createTrend(req: Request, res: Response) {
          console.log('Received request to create trend:', req.body);
          const trendData = req.body;
          console.log('Prepared trend data:', JSON.stringify(trendData, null, 2));
          const trend = new OccupancyTrendModel(trendData);
          const result = await occupancyTrendService.createTrend(trend);
          if (result) {
              res.status(200).json(result);
          } else {
              res.status(500).json({ error: "Failed to create trend" });
          }
      }
    export async function  getTrendById(req: Request, res: Response){
    try{
        const getTrend=await occupancyTrendService.getTrendById(req.params.id);
        res.json(getTrend);
    }
    catch(err:any){
res.status(500).json({massage:err.massage});
    }
}
      export async function  deleteTrend(req: Request, res: Response) {
    try{
      const deleteTrend=await occupancyTrendService.deleteTrend(req.params.id);
      res.json(deleteTrend);
    }
    catch(err){
      res.status(500).json({massage:'err.massage'});
    }
}
  //לעדכן-לבצע אופטומיזציה
  export async function  updateTrend(req:any, res:any){
    try {
      const updated =await occupancyTrendService.updateTrend(req.params.id, req.body);
      if (!updated) {
         res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', updated });
    } catch (err:any) {
      console.error(err); // חשוב גם ללוג
      res.status(500).json({
          message: err.message,
          stack: err.stack // אופציונלי – למעקב בזמן פיתוח
      });
  }
  }
  //כדי ליצא ל-csv
  export async function exportOccupancyTrendToCSV(req:Request,res:Response) {
    try{
      const csv =await occupancyTrendService.exportOccupancyTrendToCSV();
      if (!csv) {
        res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', csv });
    }
    catch (err:any) {
      console.error(err); // חשוב גם ללוג
      res.status(500).json({
          message: err.message,
          stack: err.stack // אופציונלי – למעקב בזמן פיתוח
      });
  }
  }
  //כדי לשמור את הנתונים הישנים בארכיון
  export async function archiveOldTrend(req:Request,res:Response) {
    try{
      const archion =await occupancyTrendService.archiveOldTrend();

      if (!archion) {
         res.status(404).json({ message: 'Trend not found' });
      }
      res.json({ message: 'Trend updated', archion });
    }
    catch (err:any) {
      console.error(err); // חשוב גם ללוג
      res.status(500).json({
          message: err.message,
          stack: err.stack // אופציונלי – למעקב בזמן פיתוח
      });
  }
  } 

  export async function getHistory(req: Request, res: Response) {
  try {
    const { date: dateParam } = req.params; 
    if (!dateParam) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const result = await occupancyTrendService.getHistory(date);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in controller:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

 //דיווח תפוסה לפי סוג חלל עבודה ופרק זמן
 export async function getSnapshotReport(req:Request,res:Response) {
  try{
    console.log("BODY:", req.body);
    const result=await occupancyTrendService.getSnapshotReport(req.body);
    console.log("RESULT:", result);
    res.json(result);
  }
  catch (err:any) {
    console.error(err);
    res.status(500).json({
        message: err.message,
        stack: err.stack
    });
  }
}

//במקרה שהחישוב יכשל 
export async function calculateOccupancyRate(req:Request,res:Response) {
  try{
     const calculate=await occupancyTrendService.calculateOccupancyRate(req.params.id);
     res.json(calculate);
  }
  catch (err:any) {
    console.error(err); // חשוב גם ללוג
    res.status(500).json({
        message: err.message,
        stack: err.stack // אופציונלי – למעקב בזמן פיתוח
    });
}
}
//ניהול ללקוח שיש לו כמה משימות
export async function calculateClientOccupancySnapshot(req:Request,res:Response){
  try{
    const calculateclient = await occupancyTrendService.calculateClientOccupancyTrend(req.params.customerId);

res.json(calculateclient);
  }
  catch (err:any) {
    console.error(err); // חשוב גם ללוג
    res.status(500).json({
        message: err.message,
        stack: err.stack // אופציונלי – למעקב בזמן פיתוח
    });
}
}
//אינטגרציה עם סוגי לקוחות
export async function integraionCustomer(req:Request,res:Response){
  try{
    const integration=await occupancyTrendService.integrateCustomer(req.params.customerId);
    res.json(integration);
  }
  catch (err:any) {
    console.error(err); // חשוב גם ללוג
    res.status(500).json({
        message: err.message,
        stack: err.stack // אופציונלי – למעקב בזמן פיתוח
    });
}
}
  //להקפיץ טריגר אם הקיבולת מתקרבת לסף
export async function  checkAndTriggerAlert(req: Request, res: Response) {
  try {
    const result = await occupancyTrendService.checkAndTriggerAlert(req.params.id);
    res.json(result)
  } catch (err:any) {
    console.error(err); // חשוב גם ללוג
    res.status(500).json({
        message: err.message,
        stack: err.stack // אופציונלי – למעקב בזמן פיתוח
    });
}
}
export async function sendOccupancyAlert(req:Request,res:Response) {
  try{
    const result=await occupancyTrendService.sendOccupancyAlert(req.body);
  res.json(result)
  }
  catch (err:any) {
    console.error(err); // חשוב גם ללוג
    res.status(500).json({
        message: err.message,
        stack: err.stack // אופציונלי – למעקב בזמן פיתוח
    });
}

}





