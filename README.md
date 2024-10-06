### POP POO APP

pop poo คือ แอปพลิเคชันที่ถูกสร้างขึ้นเพื่อเป็นตัวอย่างการ ออกแบบ ระบบเว็บที่มีการ update ข้อมูลแบบ real-time 
### ตัวอย่าง 
<img src="./images/01.png" width="50%" height="50%">

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

<img src="./images/ER01.drawio.png" width="50%" height="50%">

### วิธีการใช้งาน
```bash 
git clone https://github.com/Jakkapan-a/poppoo-web.git
cd poppoo-web
docker-compose up -d --build
# หรือ
docker-compose up -d 
```

### เข้าใช้งาน
- client: http://localhost

