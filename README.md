### POP POO APP

pop poo คือ แอปพลิเคชันที่ถูกสร้างขึ้นเพื่อเป็นตัวอย่างการ ออกแบบ ระบบเว็บที่มีการ update ข้อมูลแบบ real-time 
### โครงสร้างโปรเจค
```bash
pop-poo
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── App.tsx
│       ├── index.tsx
│       └── ...
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── server.ts
│   │   └── ...
│   ├── .env
│   ├── prisma
│   │   ├── schema.prisma
│   └── ...
└── ...
```

### คำอธิบายโครงสร้างโปรเจค
- client จะเป็นส่วนของ frontend ที่ใช้ React ในการพัฒนา
- server จะเป็นส่วนของ backend ที่ใช้ express + prisma + bun runtime ในการพัฒนา
- database จะใช้ postgresql ในการเก็บข้อมูล
- ระหว่าง client และ server จะใช้ socket.io ในการสื่อสารข้อมูลแบบ real-time
- ในการ deploy จะใช้ docker ในการสร้าง image และใช้ docker-compose ในการสร้าง container ของ client, server และ database

### วิธีการใช้งาน
```bash 
git clone ...
cd pop-poo
