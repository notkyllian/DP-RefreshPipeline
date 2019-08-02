import express from 'express';
import { getStatus, getAllData } from '../controllers/status';

const router = new express.Router();

router.get('/getdata/:id', getStatus);
router.get('/data', getAllData);
export default router;
