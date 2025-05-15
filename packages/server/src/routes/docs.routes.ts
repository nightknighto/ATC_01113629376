import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { OASDocument } from '../services';
const docsRouter = Router();

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(OASDocument));

export default docsRouter;
