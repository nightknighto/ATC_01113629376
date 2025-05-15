import { adminEventsOpenApiPaths } from "./admin.routes";
import { authOpenApiPaths } from "./auth.routes";
import { eventsOpenApiPaths } from "./events.routes";
import { usersOpenApiPaths } from "./users.routes";

export const openApiPaths = {
    ...authOpenApiPaths,
    ...usersOpenApiPaths,
    ...eventsOpenApiPaths,
    ...adminEventsOpenApiPaths,
};
