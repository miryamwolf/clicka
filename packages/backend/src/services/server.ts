import WebSocket from 'ws';

// יצירת שרת WebSocket שמאזין בפורט 3002
const wss = new WebSocket.Server({ port: 3002 });

interface Room {
  status: string;          // סטטוס החדר ("Available" או "Occupied")
  occupants: string[];     // רשימת משתמשים שנמצאים בחדר
}

interface HistoryEntry {
  roomId: string;
  user: string;
  timestamp: string;       // מתי התרחשה הפעולה
  action: 'enter' | 'leave'; // האם המשתמש נכנס או יצא
}

// אובייקט חדרים ראשוני
let rooms: { [key: string]: Room } = {
  'Room A': { status: 'Available', occupants: [] },
  'Room B': { status: 'Available', occupants: [] },
};

// היסטוריית פעולות נוכחות  // שליחת מצב התחלתי של חדרים וההיסטוריה ללקוח שמתחבר

let history: HistoryEntry[] = [];

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.send(JSON.stringify({ type: 'initPresence', payload: { rooms, history } }));
  ws.send(
    JSON.stringify({
      type: 'roomStatus',
      payload: Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, room.status])),
    })
  );

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'update') {
      // עדכון סטטוס חדר מסוים
      rooms[data.spaceId].status = data.status;
      if (data.status === 'Available') rooms[data.spaceId].occupants = [];
      broadcastRoomStatus();

    } else if (data.type === 'orderRequest') {
      // בקשת הזמנה לחדר
      const roomId = data.roomId;
      const isAvailable = rooms[roomId].status === 'Available';

      let messageText;

      if (isAvailable) {
        // אם החדר פנוי, מאשרים הזמנה ומשנים סטטוס
        rooms[roomId].status = 'Occupied';
        messageText = `✅ הזמנה ל-${roomId} אושרה`;
      } else {
        messageText = `❌ הזמנה ל-${roomId} נדחתה (החדר תפוס)`;
      }

      broadcastRoomStatus();

      // שליחת עדכון על תוצאת ההזמנה לכל הלקוחות
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'orderUpdate', message: messageText }));
        }
      });

    } else if (data.type === 'presenceUpdate') {
      // עדכון נוכחות בחדר (כניסה או יציאה)
      const { roomId, user, action } = data;

      if (!rooms[roomId]) return;

      if (action === 'enter') {
        // הוספת משתמש לרשימת הנוכחים
        if (!rooms[roomId].occupants.includes(user)) {
          rooms[roomId].occupants.push(user);
          rooms[roomId].status = 'Occupied';
          history.push({ roomId, user, timestamp: new Date().toISOString(), action: 'enter' });
        }

      } else if (action === 'leave') {
        // הסרת משתמש מהרשימה
        rooms[roomId].occupants = rooms[roomId].occupants.filter((u) => u !== user);
        if (rooms[roomId].occupants.length === 0) rooms[roomId].status = 'Available';

        history.push({ roomId, user, timestamp: new Date().toISOString(), action: 'leave' });
      }

      // הגבלת היסטוריה ל-100 רשומות
      if (history.length > 100) history.shift();

      broadcastPresenceUpdate();
      broadcastRoomStatus();
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
  ws.on('error', (err) => console.error('Socket error:', err));
});

// פונקציה ששולחת את הסטטוס של כל החדרים לכל הלקוחות
function broadcastRoomStatus() {
  const data = JSON.stringify({
    type: 'roomStatus',
    payload: Object.fromEntries(Object.entries(rooms).map(([id, room]) => [id, room.status])),
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
}

// פונקציה ששולחת את עדכון הנוכחות וההיסטוריה לכל הלקוחות
function broadcastPresenceUpdate() {
  const data = JSON.stringify({ type: 'presenceUpdate', payload: { rooms, history } });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
}

console.log('WebSocket server is running on ws://localhost:3002');
