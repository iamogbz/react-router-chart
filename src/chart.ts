import { RouteShape } from "global";
import { Route } from "route";

export class Chart {
    /**
     * Create a route of the specified shape
     */
    static route(shape: RouteShape): Route {
        return new Route(shape);
    }

    /**
     * Render the react-router routes
     * @param {*} route the route to render
     */
    static render(route: Route): React.ReactElement[] {
        return route.render();
    }
}
