import React from "react";
import ReactRoute from "react-router/Route";

export default class Route {
    /**
     * Create a new Route object
     * @param {{}} route shape
     */
    constructor({ name, props, renderProps, suffixes, nest } = {}) {
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
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Sets name of the route
     * @param {string} value non string values are rejected and warned against
     */
    set name(value) {
        this._name = value;
        if (value && typeof value !== "string")
            console.warn(`Route name was set to non string value '${value}'`);
    }

    /**
     * Sets name of the route
     * @param {string} name
     * @returns {Route} reference to updated object
     */
    setName = name => Object.assign(this, { name });

    /**
     * Sets react router route props
     * @param {{}} props
     * @returns {Route} reference to updated object
     */
    setProps = props => Object.assign(this, { props });

    /**
     * Adds to react router route props
     * @param {{}} props
     * @returns {Route} reference to updated object
     */
    addProps = props => {
        Object.assign(this.props, props);
        return this;
    };

    rPath = path => this.addProps({ path });

    rKey = key => this.addProps({ key });

    rExact = exact => this.addProps({ exact });

    rStrict = strict => this.addProps({ strict });

    rLocation = location => this.addProps({ location });

    rSensitive = sensitive => this.addProps({ sensitive });

    rChildren = children => this.addProps({ children });

    rComponent = component => this.addProps({ component });

    rRender = render => this.addProps({ render });

    /**
     * Extra properties passed to the render of this route.
     * When this is non empty react router render property is always used
     * @param {{}} renderProps
     * @returns {Route} reference to updated object
     */
    setRenderProps = renderProps => Object.assign(this, { renderProps });

    /**
     * List of paths appended to base, result used as Route.path prop
     * @param {[]} suffixes
     * @returns {Route} reference to updated object
     */
    setSuffixes = suffixes => Object.assign(this, { suffixes });

    /**
     * Add one or more suffixes to existing route.suffixes
     * @param {{}} suffixes
     * @returns {Route} reference to updated object
     */
    addSuffixes = suffixes =>
        Object.assign(this, {
            suffixes: Object.assign(this.suffixes, suffixes),
        });

    /**
     * Deletes specified suffixes using names as keys
     * @param {...string} names
     * @returns {Route} reference to updated object
     */
    removeSuffixes = (...names) =>
        Object.assign(this, {
            suffixes: Object.keys(this.suffixes)
                .filter(key => !names.includes(key))
                .reduce((obj, key) => {
                    obj[key] = this.suffixes[key];
                    return obj;
                }, {}),
        });

    /**
     * Optional base props passed to all children routes
     * @param {{}} props
     * @returns {Route} reference to updated object
     */
    setNestedProps = props =>
        Object.assign(this, { nest: Object.assign(this.nest, { props }) });

    /**
     * Optional extra properties passed to the render of all children routes
     * @param {{}} renderProps
     * @returns {Route} reference to updated object
     */
    setNestedRenderProps = renderProps =>
        Object.assign(this, {
            nest: Object.assign(this.nest, { renderProps }),
        });

    /**
     * List of children routes, generates react-router/Route for each base * suffixes
     * @param {[Route]} routes
     * @returns {Route} reference to updated object
     */
    setNestedRoutes = routes =>
        Object.assign(this, { nest: Object.assign(this.nest, { routes }) });

    /**
     * Add single or multiple routes to the existing list of nested routes
     * @param {...Route} routes
     * @returns {Route} reference to updated object
     */
    addNestedRoutes = (...routes) =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: [...this.nest.routes, ...routes],
            }),
        });

    /**
     * Remove from list of routes only works if nested routes were named
     * @param {...string} names
     * @returns {Route} reference to updated object
     */
    removeNestedRoutes = (...names) =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: this.nest.routes.filter(
                    route => !names.includes(route.name),
                ),
            }),
        });

    _canRender = ({ path, children, component, render }) =>
        path && (children || component || render);

    _trim = ({ name, props, renderProps }) => ({
        name,
        props,
        renderProps,
    });

    _flatten = (route, base) => {
        const routes = [];
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
                        },
                        fullPath,
                    ),
                );
            });
        });
        return routes;
    };

    /**
     * Build and return all the react-router/Route components
     * @param {string} base to append all routes to
     * @returns {[ReactRoute]}
     */
    render = (base = "") => {
        const routes = this._flatten(this, base);
        return routes.map(route => {
            const rProps = route.props;
            if (Object.values(route.renderProps).length) {
                rProps.render = props =>
                    rProps.component ? (
                        <rProps.component {...route.renderProps} {...props} />
                    ) : (
                        route.props.render({
                            ...route.renderProps,
                            ...props,
                        })
                    );
                delete rProps.component;
                delete rProps.children;
            }
            return <ReactRoute {...rProps} key={rProps.key || rProps.path} />;
        });
    };

    _describe = (route, base) => {
        const basePath = `${base || ""}${route.props.path || ""}`;
        const suffixNames = Object.keys(route.suffixes);
        const nextDirections = suffixNames.length
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
              }, {})
            : route.nest.routes.reduce((directions, nextRoute) => {
                  const nested = this._describe(nextRoute, basePath);
                  return Object.assign(
                      directions,
                      nextRoute.name ? { [nextRoute.name]: nested } : nested,
                  );
              }, {});
        return Object.assign(nextDirections, { $: basePath });
    };

    /**
     * Generate easily accessible directions to all named paths
     * @param {string} base to append all route paths to
     * @returns {{}} object with named paths
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
    describe = (base = "") => this._describe(this, base);
}
