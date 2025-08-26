import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('https://xcvehaklnnahnqueqqas.supabase.co');
    const text = await res.text();
    console.log("✅ הצליח:");
    console.log(text);
  } catch (err) {
    console.error("❌ נכשל:", err);
  }
})();
