import path from 'path';
import { Router, static as expressStatic } from 'express';
import statusrouter from './status.router';

const FRONTEND_BUILD_PATH = path.join(__dirname, '../../../frontend/build');

const router = Router();

router.use('/status', statusrouter);

router.use(expressStatic(FRONTEND_BUILD_PATH));

/*router.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
});*/

export default router;
