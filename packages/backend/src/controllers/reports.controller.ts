// import { Request, Response, NextFunction } from 'express';
// import {
//   generateRevenueDataFromPayments,
//   generateExpenseData,
//   generateProfitLossData,  // נוספה הפונקציה החדשה
//   generateCashFlowData,
//   generateOccupancyRevenueData, //  נוספה הפונקציה החדשה
// } from '../services/reportGenerators.service';
// import { ReportType, ReportParameters } from 'shared-types';

// /**
//  * Controller כללי שמקבל קריאה לדוח לפי סוג
//  * @param req - בקשת ה-HTTP (כוללת type ו-parameters)
//  * @param res - תגובת השרת ללקוח
//  */
// export class ReportController {
//   handleGenerateReport = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { type } = req.params;
//       const parameters = req.body as ReportParameters;

//       console.log('Generating report of type:', type, 'with parameters:', parameters);

//       let reportData;

//       switch (type as ReportType) {
//         case 'REVENUE':
//           reportData = await generateRevenueDataFromPayments(parameters);
//           break;
//         case 'EXPENSES':
//           reportData = await generateExpenseData(parameters);
//           break;
//         case 'PROFIT_LOSS':
//           reportData = await generateProfitLossData(parameters);
//           break;
//         case 'CASH_FLOW': 
//           reportData = await generateCashFlowData(parameters);
//           break;
//             case 'OCCUPANCY_REVENUE':  // הוסף טיפול לדוח תפוסת חללים
//           reportData = await generateOccupancyRevenueData(parameters);
//           break;
//         default:
//           res.status(400).json({ error: 'Unsupported report type' });
//           return;
//       }

//       res.json(reportData);
//     } catch (error) {
//       console.error('Error generating report:', error);
//       next(error);
//     }
//   };
// }
