import * as React from "react";
import { Route as ReactRoute } from "react-router";
import { Location } from "history";
import {
    AnyObject,
    ReactRouterRoutePropChildren,
    ReactRouterRoutePropComponent,
    ReactRouterRoutePropRender,
    ReactRouterRouteProps,
    RouteDirection,
    RouteRenderProps,
    RouteShape,
    Suffixes,
} from "global";

export class Route {
    _name: string;

    // eslint-disable-next-line react/static-property-placement
    props: ReactRouterRouteProps;

    renderProps: AnyObject;

    suffixes: Suffixes;

    nest: {
        props: ReactRouterRouteProps;
        renderProps: AnyObject;
        routes: Route[];
    };

    /**
     * Create a new Route object
     */
    constructor({ name, props, renderProps, suffixes, nest }: RouteShape = {}) {
        this.name = name ? name.toString() : undefined;
        this.props = { ...props };
        this.renderProps = { ...renderProps };
        this.suffixes = { ...suffixes };
        this.nest = nest
            ? {
                  props: { ...nest.props },
                  renderProps: { ...nest.renderProps },
                  routes: (nest.routes || []).map(shape => new Route(shape)),
              }
            : { props: {}, renderProps: {}, routes: [] };
    }

    /**
     * Get name of the route
     */
    get name(): string {
        return this._name;
    }

    /**
     * Sets name of the route. Non string values are rejected and warned against.
     */
    set name(value: string) {
        this._name = value;
    }

    /**
     * Sets name of the route.
     * Returns reference to updated object.
     */
    setName = (name: string): Route => Object.assign(this, { name });

    /**
     * Sets react router route props.
     * Returns reference to updated object.
     */
    setProps = (props: ReactRouterRouteProps): Route =>
        Object.assign(this, { props });

    /**
     * Adds to react router route props.
     * Returns reference to updated object.
     */
    addProps = (props: ReactRouterRouteProps): Route => {
        Object.assign(this.props, props);
        return this;
    };

    rPath = (path: string): Route => this.addProps({ path });

    rKey = (key: string): Route => this.addProps({ key });

    rExact = (exact: boolean): Route => this.addProps({ exact });

    rStrict = (strict: boolean): Route => this.addProps({ strict });

    rLocation = (location: Location): Route => this.addProps({ location });

    rSensitive = (sensitive: boolean): Route => this.addProps({ sensitive });

    rChildren = (children: ReactRouterRoutePropChildren): Route =>
        this.addProps({ children });

    rComponent = (component: ReactRouterRoutePropComponent): Route =>
        this.addProps({ component });

    rRender = (render: ReactRouterRoutePropRender): Route =>
        this.addProps({ render });

    /**
     * Extra properties passed to the render of this route.
     * When this is non empty react router render property is always used.
     * Returns reference to updated object.
     */
    setRenderProps = (renderProps: AnyObject): Route =>
        Object.assign(this, { renderProps });

    /**
     * List of paths appended to base, result used as Route.path prop.
     * Returns reference to updated object.
     */
    setSuffixes = (suffixes: Suffixes): Route =>
        Object.assign(this, { suffixes });

    /**
     * Add one or more suffixes to existing route.suffixes.
     * Returns reference to updated object.
     */
    addSuffixes = (suffixes: Suffixes): Route =>
        Object.assign(this, {
            suffixes: Object.assign(this.suffixes, suffixes),
        });

    /**
     * Deletes specified suffixes using names as keys
     */
    removeSuffixes = (...names: string[]): Route =>
        Object.assign(this, {
            suffixes: Object.keys(this.suffixes)
                .filter(key => !names.includes(key))
                .reduce((obj: AnyObject, key) => {
                    obj[key] = this.suffixes[key];
                    return obj;
                }, {}),
        });

    /**
     * Optional base props passed to all children routes.
     * Returns reference to updated object.
     */
    setNestedProps = (props: AnyObject): Route =>
        Object.assign(this, { nest: Object.assign(this.nest, { props }) });

    /**
     * Optional extra properties passed to the render of all children routes.
     * Returns reference to updated object.
     */
    setNestedRenderProps = (renderProps: AnyObject): Route =>
        Object.assign(this, {
            nest: Object.assign(this.nest, { renderProps }),
        });

    /**
     * List of children routes which will generate react-router/Route
     * for every combination of base and suffixes.
     * Returns reference to updated object.
     */
    setNestedRoutes = (routes: Route[]): Route =>
        Object.assign(this, { nest: Object.assign(this.nest, { routes }) });

    /**
     * Add single or multiple routes to the existing list of nested routes.
     * Returns reference to updated object.
     */
    addNestedRoutes = (...routes: Route[]): Route =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: [...this.nest.routes, ...routes],
            }),
        });

    /**
     * Remove from list of routes only works if nested routes were named.
     * Returns reference to updated object.
     */
    removeNestedRoutes = (...names: string[]): Route =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: this.nest.routes.filter(
                    route => !names.includes(route.name),
                ),
            }),
        });

    /**
     * Check if route can be rendered using props
     */
    _canRender = ({
        path,
        children,
        component,
        render,
    }: ReactRouterRouteProps): boolean =>
        Boolean(path && (children || component || render));

    /**
     * Get only the relevant props for rendering react route.
     */
    _trim = ({ name, props, renderProps }: RouteShape): RouteRenderProps => ({
        name,
        props,
        renderProps,
    });

    /**
     * Convert nested routes to list of react route renderable objects.
     */
    _flatten = (route: Route, base: string): RouteRenderProps[] => {
        const routes: RouteRenderProps[] = [];
        const pathSuffixes = Object.values(route.suffixes);
        const paths = pathSuffixes.length
            ? pathSuffixes.map(suffix => `${route.props.path || ""}${suffix}`)
            : [route.props.path];
        const {
            props: nestedProps,
            renderProps: nestedRenderProps,
            routes: nestedRoutes,
        } = route.nest;
        paths.forEach(path => {
            const fullPath = `${base}${path || ""}`;
            const props = { ...route.props, path };
            if (this._canRender(props)) {
                props.path = fullPath;
                routes.push(this._trim({ ...route, props }));
            }
            nestedRoutes.forEach(nestedRoute => {
                routes.push(
                    ...this._flatten(
                        {
                            ...nestedRoute,
                            props: {
                                ...nestedProps,
                                ...nestedRoute.props,
                            },
                            renderProps: {
                                ...nestedRenderProps,
                                ...nestedRoute.renderProps,
                            },
                        } as Route,
                        fullPath,
                    ),
                );
            });
        });
        return routes;
    };

    /**
     * Build and return all the react-router/Route components.
     */
    render = (base = ""): React.ReactElement[] => {
        const routes = this._flatten(this, base);
        return routes.map(route => {
            const rProps = { ...route.props };
            const ReactComponent = route.props.component;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const renderFn: any = route.props.render || route.props.children;
            if (Object.values(route.renderProps).length) {
                rProps.render = (props: AnyObject): React.ReactElement => {
                    const renderProps = { ...route.renderProps, ...props };
                    return ReactComponent
                        ? React.createElement(ReactComponent, renderProps)
                        : renderFn(renderProps);
                };
                delete rProps.component;
            }
            if (rProps.render) delete rProps.children;
            if (rProps.component) delete rProps.render;
            return React.createElement(ReactRoute, {
                ...rProps,
                key: String(rProps.key || rProps.path),
            });
        });
    };

    _describe = (route: Route, base: string): RouteDirection => {
        const empty: RouteDirection = { $: null };
        const basePath = `${base || ""}${route.props.path || ""}`;
        const suffixNames = Object.keys(route.suffixes);
        const nextDirections: RouteDirection = suffixNames.length
            ? suffixNames.reduce((directions, name) => {
                  const path = `${basePath}${route.suffixes[name]}`;
                  const nextRoute = {
                      ...route,
                      name,
                      props: {},
                      suffixes: {},
                  };
                  return Object.assign(directions, {
                      [name]: this._describe(nextRoute, path),
                  });
              }, empty)
            : route.nest.routes.reduce((directions, nextRoute) => {
                  const nested = this._describe(nextRoute, basePath);
                  return Object.assign(
                      directions,
                      nextRoute.name ? { [nextRoute.name]: nested } : nested,
                  );
              }, empty);
        return Object.assign(nextDirections, { $: basePath });
    };

    /**
     * Generate easily accessible directions to all named paths
     * @example
```js
{
    $: "/mybase",
    {
        demo: {
            $: "/mybase/demo/:id",
            { aChild: { $: "/mybase/demo/:id/iam/a/child" } }
        }
    },
    {
        example: {
            $: "/mybase/example/:id",
            { aChild: { $: "/mybase/example/:id/iam/a/child" } }
        }
    },
}
```
     */
    describe = (base = ""): RouteDirection => this._describe(this, base);
}
