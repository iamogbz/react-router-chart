import Route from "./route";

export default class {
    /**
     * Create a route of the specified shape
     */
    static route(shape: Route) {
        return new Route(shape);
    }

    /**
     * Render the react-router routes
     * @param {*} route the route to render
     */
    static render(route) {
        return route.render();
    }
}
