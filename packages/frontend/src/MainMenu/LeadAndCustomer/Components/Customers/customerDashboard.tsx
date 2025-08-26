import { useParams } from "react-router";

export const CustomerDashboard = () => {
    const { customerId } = useParams();
    return (
        <div>
            <h4 className="text-xl font-bold mb-4" >לוח בקרת לקוח</h4>
            <p>מזהה לקוח: {customerId}</p>
            {/* לוח בקרה של פרופיל הלקוח. מציג מידע כללי על הלקוח, סטטוס חוזים, והיסטוריית אינטראקציות.*/}
            {/* לדוג' גרפים או תרשימים הממחישים את ההיסטוריה של הלקוח, סטטוס חוזים פעילים. */}
        </div>
    );
}