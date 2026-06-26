/* ============================================================
   ตั้งค่า Supabase สำหรับตัวนับสะสม (ผู้เข้าชม + ดาวน์โหลด)
   วิธีกรอก:
   1) ไปที่ Supabase → Project Settings → Data API / API Keys
   2) คัดลอก "Project URL" มาใส่ SUPABASE_URL
   3) คัดลอก "anon public" key มาใส่ SUPABASE_ANON_KEY
   (anon key เปิดเผยในเว็บได้ตามปกติ ความปลอดภัยคุมด้วย RLS ฝั่ง Supabase)

   ⚠️ ถ้ายังไม่กรอก เว็บจะทำงานปกติทุกอย่าง เพียงแต่ตัวเลขตัวนับจะไม่ขึ้น
   ============================================================ */
window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
