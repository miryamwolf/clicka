import React, { useState } from "react";

interface ManualBookingFormProps {
  userId: string; // ID של המשתמש שכבר קיים במערכת
  onSubmitSuccess: () => void; // קריאה חזרה אחרי שליחה מוצלחת
}

export const ManualBookingForm: React.FC<ManualBookingFormProps> = ({ userId, onSubmitSuccess }) => {
  const [workspaceType, setWorkspaceType] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [recurrence, setRecurrence] = useState<string>("none");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [errors, setErrors] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!workspaceType || !startTime || !endTime || !selectedRoom) {
      setErrors("נא למלא את כל השדות");
      return false;
    }
    if (startTime >= endTime) {
      setErrors("שעת ההתחלה חייבת להיות לפני שעת הסיום");
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const bookingData = {
      userId,
      workspaceType,
      startTime,
      endTime,
      recurrence,
      roomId: selectedRoom,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        onSubmitSuccess();
      } else {
        const errorData = await response.json();
        setErrors(errorData.message || "שגיאה בשליחת ההזמנה");
      }
    } catch (err) {
      setErrors("שגיאה בשליחת ההזמנה");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הזמנת חדר ידנית</h2>

      <label>סוג חלל:</label>
      <select value={workspaceType} onChange={(e) => setWorkspaceType(e.target.value)}>
        <option value="">בחר סוג</option>
        <option value="room">חדר</option>
        <option value="lounge">לאונג'</option>
      </select>

      <label>שעת התחלה:</label>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

      <label>שעת סיום:</label>
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <label>חזרתיות:</label>
      <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
        <option value="none">ללא</option>
        <option value="daily">יומי</option>
        <option value="weekly">שבועי</option>
      </select>

      <label>בחירת חדר:</label>
      {/* כאן אפשר לשלב קומפוננטת Calendar & Room Selector */}
      <input
        placeholder="Room ID"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      />

      {errors && <p style={{ color: "red" }}>{errors}</p>}

      <button type="submit">שלח הזמנה</button>
    </form>
  );
};
