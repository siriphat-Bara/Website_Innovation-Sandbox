# Innovation Sandbox — V-MIC (เว็บ Static + ตัวนับ Supabase)

เว็บไซต์ทุน Innovation Sandbox ของศูนย์นวัตกรรมทางการแพทย์วชิรพยาบาล (V-MIC)
HTML/CSS/JS ล้วน — เก็บโค้ดบน GitHub และ deploy บน Vercel ได้ทันที
มีตัวนับ **ผู้เข้าชม** และ **จำนวนดาวน์โหลด** แบบสะสม โดยใช้ Supabase เป็นหลังบ้าน

## โครงสร้างไฟล์
```
innovation-sandbox/
├── index.html        หน้าแรก (Home + ตัวนับผู้เข้าชม)
├── criteria.html     หลักเกณฑ์และข้อกำหนด
├── steps.html        ขั้นตอนการสมัคร
├── forms.html        แบบฟอร์ม / ดาวน์โหลด (มีตัวนับต่อเอกสาร)
├── css/style.css     สไตล์ทั้งหมด
├── js/main.js        สคริปต์ทั้งหมด (นาฬิกา, ดาวน์โหลด, ตัวนับ)
├── js/config.js      ⭐ ใส่ค่า Supabase ที่นี่
├── supabase-setup.sql  สคริปต์ตั้งตาราง/ฟังก์ชันบน Supabase
└── README.md
```

## ขั้นตอนที่ 1 — ตั้งค่า Supabase (ทำครั้งเดียว)
1. เข้า https://supabase.com → เปิดโปรเจกต์ (หรือสร้างใหม่ฟรี)
2. เมนูซ้าย **SQL Editor → New query** → เปิดไฟล์ `supabase-setup.sql` คัดลอกทั้งหมดมาวาง → กด **Run**
3. ไปที่ **Project Settings → API**
   - คัดลอก **Project URL**
   - คัดลอก **anon public** key
4. เปิดไฟล์ `js/config.js` แล้วใส่ค่าทั้งสองลงไปแทนข้อความ `YOUR-...`

> หมายเหตุ: anon key เปิดเผยในเว็บได้ตามปกติ ความปลอดภัยคุมด้วย RLS + ฟังก์ชันที่จำกัดเฉพาะ key ที่อนุญาต
> ถ้ายังไม่ใส่ค่า เว็บจะทำงานปกติทุกอย่าง เพียงแต่ตัวเลขตัวนับจะไม่ขึ้น

## ขั้นตอนที่ 2 — เก็บโค้ดบน GitHub
ทำใน VS Code (Terminal) ที่โฟลเดอร์ที่มี `index.html`:
```bash
git init
git add .
git commit -m "init innovation sandbox"
git branch -M main
git remote add origin https://github.com/V-mic-vjr/Innovation-Sandbox.git
git push -u origin main
```

## ขั้นตอนที่ 3 — Deploy บน Vercel
1. เข้า https://vercel.com → Log in ด้วย GitHub
2. **Add New… → Project** → เลือก repository `Innovation-Sandbox`
3. **Framework Preset: Other** (ไม่ต้องตั้ง Build Command / Output) → กด **Deploy**
4. รอสักครู่ จะได้ลิงก์เว็บ เช่น `https://innovation-sandbox.vercel.app`
5. ครั้งต่อไปแค่ `git push` Vercel จะ deploy ให้อัตโนมัติ

## การแก้ไขเนื้อหา
- เนื้อหา "หลักเกณฑ์/ขั้นตอน" ที่เป็นตัวอย่าง แก้ที่คอมเมนต์ `<!-- ✏️ แก้ไข... -->` ใน `criteria.html` / `steps.html`
- เปลี่ยนเมนู/โลโก้/ข้อมูลติดต่อ: แก้ในส่วน NAVBAR และ FOOTER ของทุกไฟล์ .html (4 ไฟล์) ให้ตรงกัน
- เปลี่ยนสี/ฟอนต์: แก้ตัวแปร `:root` ด้านบนของ `css/style.css`

## การทดสอบ / รีเซ็ตตัวนับ
- ตัวนับผู้เข้าชมนับ 1 ครั้งต่อผู้ใช้ (จำด้วย localStorage) — ทดสอบซ้ำให้เปิด Incognito หรือล้างข้อมูลเว็บ
- รีเซ็ตค่าเป็น 0: ที่ Supabase → SQL Editor รัน `update public.counters set count = 0;`

## หมายเหตุ
- ไฟล์ Google ต้องตั้งแชร์เป็น "ทุกคนที่มีลิงก์ดูได้" ปุ่มดาวน์โหลดจึงจะโหลดได้
- ตอนทดสอบในเครื่อง อย่าดับเบิลคลิกเปิดไฟล์ตรง ๆ ให้เปิดผ่านเซิร์ฟเวอร์ (เช่น VS Code Live Server) หรือดูบน Vercel
