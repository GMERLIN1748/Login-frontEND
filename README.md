# ระบบ Authentication: Login ด้วย Email/Password และ GitHub

เว็บแอปพลิเคชัน Next.js ที่มีระบบสมัครสมาชิก เข้าสู่ระบบ และควบคุมสิทธิ์การเข้าถึงหน้าเว็บตามบทบาทผู้ใช้ (Role-Based Access Control) รองรับการ login 2 แบบ คือ Email/Password และ GitHub OAuth

- **ชื่อ-นามสกุล:** _(ใส่ชื่อของคุณ)_
- **รหัสนักศึกษา:** _(ใส่รหัสนักศึกษา)_
- **รายวิชา:** _(ใส่ชื่อวิชา)_

## ฟีเจอร์

- สมัครสมาชิกด้วย Email/Password (รหัสผ่านถูกเข้ารหัสด้วย bcrypt ก่อนเก็บลงฐานข้อมูล)
- เข้าสู่ระบบด้วย Email/Password
- เข้าสู่ระบบด้วย GitHub (OAuth)
- ควบคุมสิทธิ์ตามบทบาท `ADMIN`, `STAFF`, `USER`
- หน้า Admin Dashboard เข้าได้เฉพาะ `ADMIN`
- หน้า "ไม่มีสิทธิ์เข้าถึง" สำหรับผู้ที่ไม่มีสิทธิ์
- ปุ่มออกจากระบบ

## เทคโนโลยีที่ใช้

| เทคโนโลยี | หน้าที่ |
|---|---|
| Next.js 16 (App Router) | เฟรมเวิร์กหลัก |
| React 19 + TypeScript | ส่วนติดต่อผู้ใช้ |
| Auth.js (`next-auth@beta`) | ระบบ Authentication |
| bcryptjs | เข้ารหัสรหัสผ่าน |
| Prisma 7 + SQLite | ฐานข้อมูล (ไฟล์ `dev.db`) |
| Tailwind CSS 4 | จัดรูปแบบหน้าเว็บ |

## สิ่งที่ต้องติดตั้งก่อน

1. **Node.js** เวอร์ชัน 20 ขึ้นไป (https://nodejs.org)
2. **Git** (https://git-scm.com)
3. **บัญชี GitHub** สำหรับสร้าง OAuth App

## วิธีติดตั้ง

**1. ดึงโค้ดและติดตั้งไลบรารี**

```bash
git clone <URL ของ repository นี้>
cd <ชื่อโฟลเดอร์>
npm install
```

**2. สร้าง GitHub OAuth App**

1. เข้า GitHub → รูปโปรไฟล์ → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. กรอกข้อมูล

| ช่อง | ค่า |
|---|---|
| Application name | `Next.js RBAC Demo` |
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |

3. กด **Register application**
4. คัดลอก **Client ID** แล้วกด **Generate a new client secret** แล้วคัดลอก secret ไว้ (ดูได้ครั้งเดียว)

**3. สร้างไฟล์ `.env`**

สร้างไฟล์ `.env` ในโฟลเดอร์โปรเจกต์ (ระดับเดียวกับ `package.json`)

```env
DATABASE_URL="file:./dev.db"

AUTH_SECRET="ข้อความสุ่มยาวๆ สำหรับเข้ารหัส session"

AUTH_GITHUB_ID="Client ID จาก GitHub"
AUTH_GITHUB_SECRET="Client secret จาก GitHub"
```

สร้างค่า `AUTH_SECRET` ได้ด้วยคำสั่งใดคำสั่งหนึ่ง

```bash
npx auth secret
```

หรือ

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> ชื่อตัวแปรต้องเป็น `AUTH_SECRET` เท่านั้น และห้ามนำไฟล์ `.env` ขึ้น GitHub (ถูกกันไว้ใน `.gitignore` แล้ว)

**4. สร้างตารางฐานข้อมูลและ Prisma Client**

```bash
npx prisma migrate dev
npx prisma generate
```

> หากขึ้นข้อความว่าหาไฟล์ config ไม่เจอ ให้เพิ่ม `--config prisma7.config.ts` ต่อท้ายคำสั่ง

**5. รันโปรเจกต์**

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ http://localhost:3000

## วิธีใช้งาน

### สมัครสมาชิกและเข้าสู่ระบบ

1. เปิด `/signup` กรอกชื่อ อีเมล และรหัสผ่านอย่างน้อย 6 ตัวอักษร แล้วกดสร้างบัญชี
2. ระบบพากลับหน้า `/login` ให้เข้าสู่ระบบด้วยบัญชีที่สมัคร
3. หรือกด **Sign in with GitHub** เพื่อเข้าสู่ระบบด้วยบัญชี GitHub

### สิทธิ์ของผู้ใช้

| บทบาท | วิธีได้รับ | เข้า `/admin` ได้ไหม |
|---|---|---|
| `USER` | สมัครใหม่ หรือ login ด้วย GitHub (ค่าเริ่มต้น) | ไม่ได้ (ถูกส่งไป `/unauthorized`) |
| `STAFF` | ผู้ดูแลระบบตั้งค่าในฐานข้อมูล | ไม่ได้ |
| `ADMIN` | ผู้ดูแลระบบตั้งค่าในฐานข้อมูล | ได้ |

ผู้สมัครใหม่เป็น `USER` เสมอ เพื่อป้องกันไม่ให้ใครก็ได้สมัครแล้วได้สิทธิ์ผู้ดูแลระบบ

### วิธีตั้งผู้ใช้ให้เป็น ADMIN

เนื่องจาก Prisma Studio ไม่รองรับฐานข้อมูลแบบ `file:./dev.db` ให้เปลี่ยนสิทธิ์ผ่านสคริปต์แทน

**ดูรายชื่อผู้ใช้**

```bash
node -e "const D=require('better-sqlite3'); const db=new D('dev.db'); console.log(db.prepare('SELECT id, email, role FROM User').all())"
```

**เปลี่ยนเป็น ADMIN** (แทน `you@example.com` ด้วยอีเมลของผู้ใช้ เขียนตัวพิมพ์เล็ก)

```bash
node -e "const D=require('better-sqlite3'); const db=new D('dev.db'); console.log(db.prepare('UPDATE User SET role=? WHERE email=?').run('ADMIN','you@example.com'))"
```

ถ้าผลลัพธ์แสดง `changes: 1` แปลว่าเปลี่ยนสำเร็จ จากนั้นผู้ใช้ต้อง **ออกจากระบบแล้ว login ใหม่** เพื่อให้สิทธิ์ใหม่มีผล

## เส้นทางของเว็บ

| เส้นทาง | คำอธิบาย | ต้อง login |
|---|---|---|
| `/signup` | สมัครสมาชิก | ไม่ |
| `/login` | เข้าสู่ระบบ (Email/Password และ GitHub) | ไม่ |
| `/admin` | Admin Dashboard | ใช่ และต้องเป็น `ADMIN` |
| `/unauthorized` | หน้าแจ้งว่าไม่มีสิทธิ์ | ไม่ |
| `/api/auth/*` | เส้นทางภายในของ Auth.js | - |

## โครงสร้างโปรเจกต์

```text
app/
├── auth.ts                          # ตั้งค่า Auth.js (Credentials + GitHub)
├── api/auth/[...nextauth]/route.ts  # route handler ของ Auth.js
├── login/page.tsx                   # หน้าเข้าสู่ระบบ
├── signup/
│   ├── actions.ts                   # Server Action สมัครสมาชิก
│   └── page.tsx                     # หน้าสมัครสมาชิก
├── admin/page.tsx                   # หน้า Admin (เฉพาะ ADMIN)
├── unauthorized/page.tsx            # หน้าไม่มีสิทธิ์
└── lib/prisma.ts                    # ตัวเชื่อมต่อ Prisma
types/next-auth.d.ts                 # ประกาศ type ของ role และ id
prisma/schema.prisma                 # model User และ enum Role
.env                                 # ค่าลับ (ไม่ขึ้น GitHub)
```

## หมายเหตุด้านความปลอดภัย

- รหัสผ่านถูกเข้ารหัสด้วย bcrypt (cost 12) ไม่เก็บรหัสผ่านจริง
- ผู้ที่ login ด้วย GitHub ไม่ถูกบันทึกในตาราง `User` (ใช้ session แบบ JWT) จึงเป็น `USER` เสมอ
- ห้ามเผยแพร่ค่า `AUTH_SECRET` และ `AUTH_GITHUB_SECRET`

## การแก้ปัญหาเบื้องต้น

| อาการ | วิธีแก้ |
|---|---|
| `Module not found: Can't resolve 'bcryptjs'` | รัน `npm install` แล้วรีสตาร์ทเซิร์ฟเวอร์ |
| ขึ้นข้อผิดพลาดเรื่อง secret ตอน login | ตรวจว่าตัวแปรชื่อ `AUTH_SECRET` (ไม่ใช่ `BETTER_AUTH_SECRET`) แล้วรีสตาร์ท |
| GitHub แจ้ง `redirect_uri` ไม่ตรง | ตรวจ callback URL ให้เป็น `http://localhost:3000/api/auth/callback/github` |
| แก้ `.env` แล้วไม่มีผล | รีสตาร์ท `npm run dev` |
| เปลี่ยนเป็น ADMIN แล้วยังเข้า `/admin` ไม่ได้ | ออกจากระบบแล้ว login ใหม่ |
| `Prisma Studio is not supported for "file:./dev.db"` | ใช้สคริปต์ `node -e` ด้านบนแทน |
| `Another next dev server is already running` | ใช้เซิร์ฟเวอร์ตัวเดิม หรือปิดด้วย `taskkill /PID <PID> /F` |
| `Port 3000 is in use` | ใช้พอร์ตที่ระบบแจ้ง หรือปิดตัวที่รันอยู่ |

## ผู้จัดทำ

_(ใส่ชื่อ-นามสกุล รหัสนักศึกษา)_
