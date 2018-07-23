import React from "react";
import Route from "react-router/Route";

export default class {
    constructor({ name, props, renderProps, suffixes, nest } = {}) {
        this.name = name ? name.toString() : undefined;
        this.props = Object.assign({}, props);
        this.renderProps = Object.assign({}, renderProps);
        this.suffixes = Object.assign({}, suffixes);
        this.nest = nest
            ? {
                  props: Object.assign({}, nest.props),
                  renderProps: Object.assign({}, nest.renderProps),
                  routes: [...(nest.routes || [])],
              }
            : { props: {}, renderProps: {}, routes: [] };
    }

    /**
     * Get name of the route
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
     * @returns {} reference to updated object
     */
    setName = name => {
        this.name = name;
        return this;
    };

    /**
     * Sets react router route props
     * @param {} props
     * @returns {} reference to updated object
     */
    setProps = props => {
        Object.assign(this.props, props);
        return this;
    };

    rPath = path => this.setProps({ path });

    rKey = key => this.setProps({ key });

    rExact = exact => this.setProps({ exact });

    rStrict = strict => this.setProps({ strict });

    rLocation = location => this.setProps({ location });

    rSensitive = sensitive => this.setProps({ sensitive });

    rChildren = children => this.setProps({ children });

    rComponent = component => this.setProps({ component });

    rRender = render => this.setProps({ render });

    /**
     * Extra properties passed to the render of this route.
     * When this is non empty react router render property is always used
     */
    setRenderProps = renderProps => Object.assign(this, { renderProps });

    /**
     * List of paths appended to base, result used as Route.path prop
     */
    setSuffixes = suffixes => Object.assign(this, { suffixes });

    /**
     * Add one or more suffixes to existing route.suffixes
     */
    addSuffixes = (...suffixes) =>
        Object.assign(this, {
            suffixes: Object.assign(this.suffixes, suffixes),
        });

    /**
     * Deletes specified suffixes using names as keys
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
     */
    setNestedProps = props =>
        Object.assign(this, { nest: Object.assign(this.nest, { props }) });

    /**
     * Optional extra properties passed to the render of all children routes
     */
    setNestedRenderProps = renderProps =>
        Object.assign(this, {
            nest: Object.assign(this.nest, { renderProps }),
        });

    /**
     * List of children routes, generates react-router/Route for each base * suffixes
     */
    setNestedRoutes = routes =>
        Object.assign(this, { nest: Object.assign(this.nest, { routes }) });

    /**
     * Add single or multiple routes to the existing list of nested routes
     */
    addNestedRoutes = (...routes) =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: [...this.nest.routes, ...routes],
            }),
        });

    /**
     * Remove from list of routes only works if nested routes were named
     */
    removeNestedRoutes = (...names) =>
        Object.assign(this, {
            nest: Object.assign(this.nest, {
                routes: this.nest.routes.filter(
                    route => !names.includes(route.name),
                ),
            }),
        });

    _canRender = ({ path, children, component, render } = {}) =>
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
            const fullPath = `${base}${path}`;
            const props = Object.assign({}, route.props, { path });
            if (this._canRender(props)) {
                props.path = fullPath;
                routes.push(this._trim(Object.assign({}, route, { props })));
            }
            nestedRoutes.forEach(nestedRoute => {
                routes.push(
                    ...this._flatten(
                        Object.assign({}, nestedRoute, {
                            props: Object.assign(
                                {},
                                nestedProps,
                                nestedRoute.props,
                            ),
                            renderProps: Object.assign(
                                {},
                                nestedRenderProps,
                                nestedRoute.renderProps,
                            ),
                        }),
                        fullPath,
                    ),
                );
            });
        });
        return routes;
    };

    /**
     * Build react router route components
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
            return <Route {...rProps} key={rProps.key || rProps.path} />;
        });
    };
}
