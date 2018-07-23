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
}
