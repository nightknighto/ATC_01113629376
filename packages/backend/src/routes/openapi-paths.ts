import { adminEventsOpenApiPaths } from "./admin.routes";
import { authOpenApiPaths } from "./auth.routes";
import { eventsOpenApiPaths } from "./events.routes";
export const openApiPaths = {
    ...authOpenApiPaths,
    ...eventsOpenApiPaths,
    ...adminEventsOpenApiPaths,
};
