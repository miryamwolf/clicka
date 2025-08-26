// יצירת הזמנה ע''י לקוח
export async function createOrderByCustomer(id: any) { 
}
//פונקציה המאשרת את ההזמנה
export async function orderConfirmation(id: any) { 
}
//מחיקת הזמנה
export async function deleteOrder(id: any) { 
}
//עדכון הזמנה
export async function updateOrder(id: any) { 
}
//בדיקת תקינות ההזמנה
export async function checkValidOrder(id: any) { 
}
//שליחת הודעת אישור באישור ההזמנה
export async function messageOnCinfirmation(id: any) { 
}
//ניהול התשלום
export async function paymentManagement(id: any) { 
}
//חישוב קנסות
export async function calculateFines(id: any) { 
}
//אימות משתמשים
export async function validUsers(id: any) { 
}
//בדיקת ההזמנות שאין התנגשויות
export async function checkOrders(id: any) { 
}
//שליחת תזכורת אישור וטיפול במקרה שהאישור לא מתקבל
export async function sendApprovalReminder(id: any) { 
}
// חישוב מחדש של עלות ההזמנה במקרה של שינוי
export async function recalculateCharge(bookingId: any): Promise<void> {
}