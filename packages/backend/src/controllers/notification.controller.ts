import { Request, Response } from "express";
import {
  sendOverdueInvoiceAlerts,
  sendUpcomingPaymentReminders,
  getNotificationHistoryForCustomer,
  // updateNotificationTemplate,
  // syncNotificationsWithEmailSystem,
  // updateNotificationStatus
} from "../services/notification.services";

// שליחת התראות על חשבוניות באיחור
export const overdueInvoiceAlerts = async (req: Request, res: Response) => {
  try {
    await sendOverdueInvoiceAlerts();
    res.status(200).json({ message: "התראות נשלחו בהצלחה" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// שליחת תזכורות על תשלומים מתקרבים
export const upcomingPaymentReminders = async (req: Request, res: Response) => {
  try {
    const { daysBeforeDue } = req.body;
    await sendUpcomingPaymentReminders(daysBeforeDue);
    res.status(200).json({ message: "תזכורות נשלחו בהצלחה" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// היסטוריית התראות ללקוח
export const notificationHistoryForCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const history = await getNotificationHistoryForCustomer(customerId);
    res.status(200).json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// עדכון תבנית התראה
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const update = req.body;
    // const template = await updateNotificationTemplate(templateId, update);
    // res.status(200).json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// סנכרון התראות עם מערכת המייל
export const syncWithEmail = async (req: Request, res: Response) => {
  try {
    const notifications = req.body.notifications;
    // const result = await syncNotificationsWithEmailSystem(notifications);
    // res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// עדכון סטטוס התראה
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    // const log = await updateNotificationStatus(notificationId, status);
    // res.status(200).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};