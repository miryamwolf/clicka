import type{ ID } from "shared-types";


//שולחת התראות על חשבוניות באיחור לכל הלקוחות הרלוונטיים.
export  const sendOverdueInvoiceAlerts= async (): Promise<void>=>{
    // כאן תבוא לוגיקה לשליחת התראות על חשבוניות באיחור
};

/**
 * @param daysBeforeDue מספר הימים לפני מועד הפירעון לשליחת התזכורת
 */
export const  sendUpcomingPaymentReminders=async(daysBeforeDue: number): Promise<void>=>{
    // כאן תבוא לוגיקה לשליחת תזכורות על תשלומים מתקרבים
    // לדוגמה, לשלוח התראה 3 ימים לפני מועד פירעון
};

/**
 * מחזירה היסטוריית התראות שנשלחו ללקוח מסוים.
 * @param customerId מזהה הלקוח
 * @returns Promise<NotificationLog[]> - מערך לוגים של התראות שנשלחו.
 */
export const  getNotificationHistoryForCustomer=async(customerId: ID)/*: Promise<NotificationLog[]>*/=>{

};

/**
 * מאפשרת לערוך תבנית התראה (כותרת, גוף, משתנים).
 * @param templateId מזהה התבנית
 * @param update ערכים לעדכון
 * @returns Promise<NotificationTemplate> - התבנית המעודכנת.
 */
// export const updateNotificationTemplate=async(templateId: ID, update: Partial<NotificationTemplate>): Promise<NotificationTemplate>={
    
// };
/**
 * מסנכרנת התראות עם מערכת המייל (שולחת בפועל דרך אינטגרציה קיימת).
 * @param notifications מערך התראות לשליחה
 * @returns Promise<EmailSendResult[]> - מערך תוצאות שליחה לכל התראה.
 */
// export const syncNotificationsWithEmailSystem = async (notifications: NotificationToSend[]): Promise<EmailSendResult[]> => {
//     // return Promise.all(
//     //   notifications.map(n => sendEmail(n.to, n.subject, n.body))
//     // );
// };

/**
 * מעדכנת סטטוס של התראה מסוימת (למשל: נשלחה, נפתחה, נצפתה).
 * @param notificationId מזהה ההתראה
 * @param status הסטטוס החדש
 * @returns Promise<NotificationLog> - לוג ההתראה לאחר העדכון.
 */
// export const updateNotificationStatus=(
//   notificationId: ID,
// //   status: NotificationStatus
// ): Promise<NotificationLog>;

