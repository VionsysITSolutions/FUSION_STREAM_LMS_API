import { Router } from 'express';
import certificateController from '../controller/certificate.controller';
import authenticateUser from '../middleware/authenticate';

const certificateRouter = Router();

certificateRouter.route('/').post(authenticateUser(), certificateController.createCertificate).get(authenticateUser(), certificateController.getStudentCertificate);

certificateRouter.route('/:id').post(certificateController.verifyCertificate).put(authenticateUser(), certificateController.updateCertificate).get(authenticateUser(), certificateController.getCertificateById)


export default certificateRouter;