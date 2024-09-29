import { Router } from 'express';
import {checkUsername, hasSignedIn, register, singIn} from '../controllers/auth';

const router = Router();

router.post('/sign-in', async (req:any, res:any) =>{ await singIn(req, res)});
router.post('/signup', async (req:any, res:any) =>{ await register(req, res)});
router.get('/check-username/:username', async (req:any, res:any) =>{ await checkUsername(req, res)});
router.get('/has-signed-in/:username', async (req:any, res:any) =>{ await hasSignedIn(req, res)});
export default router;