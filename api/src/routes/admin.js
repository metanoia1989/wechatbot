import * as express from "express";
import * as adminController from "../controllers/admin.js";
import auth from "../util/auth.js";
const router = express.Router();
router.post('/login', adminController.validate.userLogin, adminController.login);
router.post('/logout', auth.required, adminController.logout);
router.get('/me', auth.required, adminController.me);
router.post('/update', adminController.validate.userUpdate, auth.required, adminController.update);
export default router;
