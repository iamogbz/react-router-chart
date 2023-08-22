import { RouteObject } from "react-router-dom";

export const $ = Symbol("$"); // route name
export const $$ = Symbol("$$"); // route index
export type NamedRoute = {
    [$]?: string;
    [$$]?: string;
    [k: string]: NamedRoute;
};

const DELIMITER_URL_PATH = "/";

export class Chart {
    static INDEX = $$;
    static NAME = $;
    static ROOT = DELIMITER_URL_PATH;

    /**
     * Create named routes from route objects
     * @param {*} route the route to render
     */
    static describe(...routes: RouteObject[]): NamedRoute {
        return createNamedRoutes(routes);
    }
}

function createNamedRoutes(routes: RouteObject[]): NamedRoute {
    const namedRoutes: NamedRoute = {};
    const [flattenedRoutes, indexedRoutes] = flattenRoutes(routes);
    flattenedRoutes.forEach((routePath) => {
        const pathSegments = splitPath(routePath);
        let namedRouteRef = namedRoutes;
        pathSegments.forEach((pathSegment, i) => {
            if (!namedRouteRef[pathSegment]) {
                namedRouteRef[pathSegment] = {};
            }
            const routePath = joinPathSegments(pathSegments.slice(0, i + 1));
            if (indexedRoutes.has(routePath) && !namedRouteRef[$$]) {
                namedRouteRef[$$] = routePath;
            }
            namedRouteRef = namedRouteRef[pathSegment];
            if (!namedRouteRef[$]) {
                namedRouteRef[$] = routePath;
            }
        });
    });

    return namedRoutes;
}

function flattenRoutes(
    routes: RouteObject[],
    path?: string,
): [string[], Set<string>] {
    const flattenedRoutes = Array.from<string>([]);
    const indexedRoutes = new Set<string>();

    routes.forEach((route) => {
        const routePath = joinPathSegments([path, route.path]);
        const [flattenedRoute, indexedRoute] = flattenRoute(route, routePath);
        flattenedRoutes.push(...flattenedRoute);
        indexedRoute.forEach((v) => indexedRoutes.add(v));
        if (route.index) indexedRoutes.add(routePath);
    });

    return [flattenedRoutes, indexedRoutes];
}

function flattenRoute(
    route: RouteObject,
    path?: string,
): [string[], Set<string>] {
    const [flattenedRoutes, indexedRoutes] = route.children
        ? flattenRoutes(route.children, path)
        : [[], new Set<string>()];
    return [(path ? [path] : []).concat(...flattenedRoutes), indexedRoutes];
}

function splitPath(path: string): string[] {
    function* pathSegments(path: string) {
        if (path.startsWith(DELIMITER_URL_PATH)) {
            yield DELIMITER_URL_PATH;
        }
        let staged = "";
        const segments = path.split(DELIMITER_URL_PATH);
        while (segments.length) {
            const next = segments.shift();
            if (staged) {
                yield staged;
            }
            if (next) {
                staged = next;
            }
        }
        if (staged) {
            yield staged;
        }
    }
    return [...pathSegments(path)];
}

function joinPathSegments(pathSegments: (string | undefined)[]): string {
    const validSegments = pathSegments.filter(Boolean);

    const joinedPathSegments = validSegments
        .map((p) => (p === DELIMITER_URL_PATH ? "" : p))
        .join(DELIMITER_URL_PATH);

    const shouldPrefixJoinedPathWithDelimiter =
        validSegments[0] === DELIMITER_URL_PATH &&
        !joinedPathSegments.startsWith(DELIMITER_URL_PATH);

    return `${
        shouldPrefixJoinedPathWithDelimiter ? DELIMITER_URL_PATH : ""
    }${joinedPathSegments}`;
}
