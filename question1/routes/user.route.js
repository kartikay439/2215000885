import {Router} from 'express';
import {getUserNoSorting,getPosts,getTopUsers} from '../controller/user.controller.js';
const router = Router();



router.get('/users', getTopUsers);

router.get('/posts', getPosts);

export default router;