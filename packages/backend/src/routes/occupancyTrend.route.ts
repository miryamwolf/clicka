import  express  from "express";
import * as OccupancyTrendControllers from '../controllers/occupancyTrend.controllers';

const occupancyrouter=express.Router();
occupancyrouter.get('/report/:id', OccupancyTrendControllers.getSnapshotReport);
occupancyrouter.get('/client/:customerId/calculate', OccupancyTrendControllers.calculateClientOccupancySnapshot);
occupancyrouter.post('/dontsent', OccupancyTrendControllers.sendOccupancyAlert);
occupancyrouter.post('/capacity',OccupancyTrendControllers.checkAndTriggerAlert);
occupancyrouter.post('/rate',OccupancyTrendControllers.calculateOccupancyRate);
occupancyrouter.post('/client/:customerId/integrate', OccupancyTrendControllers.integraionCustomer);
occupancyrouter.put('/updateTrend/:id', OccupancyTrendControllers.updateTrend);
occupancyrouter.put('/:id/archive',OccupancyTrendControllers.archiveOldTrend);
occupancyrouter.get('/getAllTrends', OccupancyTrendControllers.getAllTrends);
occupancyrouter.get('/:id/export', OccupancyTrendControllers.exportOccupancyTrendToCSV);
occupancyrouter.post('/createTrend', OccupancyTrendControllers.createTrend);
occupancyrouter.delete('/deleteTrend/:id', OccupancyTrendControllers.deleteTrend);
occupancyrouter.get('/getTrendById/:id', OccupancyTrendControllers.getTrendById);
occupancyrouter.get('/getHistory/:date',OccupancyTrendControllers.getHistory);

export default occupancyrouter;


