// import express from 'express'; // ייבוא express לצורך יצירת router חדש
// import { ReportController } from '../controllers/reports.controller'; // ייבוא הפונקציה מה-controller שמטפלת בבקשות לדוחות

// const routerReport = express.Router(); // יצירת instance של express router
// const reportController=new ReportController(); // יצירת instance של ה-controller
// // מסלול POST לדוחות
// // כתובת ה-API תהיה /api/billing/reports/:type
// routerReport.post('/:type', reportController.handleGenerateReport.bind(reportController)); // קישור הפונקציה מה-controller למסלול זה
// // לדוגמה: POST /api/billing/reports/REVENUE
// // :type יכול להיות כל אחד מהדוחות (REVENUE, EXPENSES וכו')

// export default routerReport; // ייצוא ברירת מחדל של ה-router
