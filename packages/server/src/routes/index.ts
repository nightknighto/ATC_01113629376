import { Router } from "express";
import authRoutes from "./auth.routes";
import eventsRoutes from "./events.routes";
import usersRoutes from "./users.routes";
import adminRoutes from "./admin.routes";

const mainRouter = Router();

mainRouter.use("/auth", authRoutes);
mainRouter.use("/events", eventsRoutes);
mainRouter.use("/users", usersRoutes);
mainRouter.use("/admin", adminRoutes);

// Health check route
mainRouter.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default mainRouter;