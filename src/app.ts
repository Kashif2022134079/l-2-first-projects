import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorhandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', test);

app.use(globalErrorhandler);
app.use(notFound);

export default app;
