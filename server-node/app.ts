import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import { calendarRouter } from "./routes/booking";

const app = express();
app.use(express.json());
app.use(cors( {origin: ['http://localhost:4201', 'https://booking-manager-admin.onrender.com/']} ))
app.use(express.static('public'));

//routes
app.use('/api/booking', calendarRouter);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get("*", (req: Request, res: Response) => {
  res.redirect("/");
})

const PORT = process.env.PORT || 3701;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));