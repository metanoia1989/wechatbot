import * as express from "express";
import * as contactController from "../controllers/contact.js";
import auth from "../util/auth.js";
const router = express.Router();
router.get('/listContact', auth.required, contactController.validate.listContact, contactController.listContact);
router.post('/syncContact', auth.required, contactController.syncContact);
router.get('/findWelcome', auth.required, contactController.validate.findWelcome, contactController.findWelcome);
router.post('/updateWelcome', auth.required, contactController.validate.updateWelcome, contactController.updateWelcome);
export default router;
