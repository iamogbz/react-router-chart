# React Router Chart

Create a single source map of truth for all routes in your react app and easily render in react-router

[![NPM Version](https://img.shields.io/npm/v/react-router-chart.svg)](https://www.npmjs.com/package/react-router-chart)
[![Build Status](https://github.com/iamogbz/react-router-chart/workflows/Build/badge.svg)](https://github.com/iamogbz/react-router-chart/actions?query=workflow%3ABuild)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-router-chart/badge.svg?branch=master&cache=0)](https://coveralls.io/github/iamogbz/react-router-chart?branch=master)
[![Dependabot badge](https://badgen.net/github/dependabot/iamogbz/react-router-chart/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://img.shields.io/librariesio/github/iamogbz/react-router-chart)](https://libraries.io/github/iamogbz/react-router-chart)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/iamogbz/react-router-chart)

## Getting Started

### Install

Include in your dependencies.

```sh
npm install 'react-router-chart'
```

#### Recommended

Use `React.lazy` and `React.Suspense` to separate component logic from route mapping, by deferring the load of the component to the time of render.

[See more](https://reactjs.org/docs/code-splitting.html#reactlazy)

## API Reference

### The `Route` Object

This is what defines a mapping of `ReactRouter` objects. Should not be confused with `react-router/Route`.

#### Shapes

```ts
// https://reacttraining.com/react-router/web/api/Route
type ReactRouterRouteProps;

// https://reactjs.org/docs/components-and-props
type AnyObject;

// Used to initialise the Route object.
export interface RouteShape {
    name?: string;
    props?: ReactRouterRouteProps;
    renderProps?: AnyObject;
    suffixes?: Suffixes;
    nest?: {
        props?: ReactRouterRouteProps;
        renderProps?: AnyObject;
        routes?: RouteShape[];
    };
}

// Object with values as the path suffix and keys as path names.
export interface Suffixes {
    [name: string]: string;
}
```

#### Methods

These methods on the `route`. Most return a reference to the updated object for easier mapping.

##### `setName(String): Route`

Sets `route.name` and returns updated object for chaining. This is the value used for describing directions, therefore must be unique in the context of its parent route.

##### `setProps(Object): Route`

Sets `route.props` and returns updated object for chaining. See [add props](#addpropsobject-route) to apply a partial update.

##### `addProps(Object): Route`

Updates `route.props` and returns updated object for chaining. Accepts all [`react-router/Route`](https://reacttraining.com/react-router/web/api/Route) props, using `path` as the `base` for suffixes when rendered.

##### `rPath(String): Route`

Sets [`route.props.path`](https://reacttraining.com/react-router/web/api/Route/path-string-string) and returns updated object for chaining.

##### `rkey(String): Route`

Sets `route.props.key` and returns updated object for chaining.

This is passed to any rendered `react-router/Route` as the `key` prop.

##### `rExact(Boolean): Route`

Sets [`route.props.exact`](https://reacttraining.com/react-router/web/api/Route/exact-bool) and returns updated object for chaining.

##### `rStrict(Boolean): Route`

Sets [`route.props.strict`](https://reacttraining.com/react-router/web/api/Route/strict-bool) and returns updated object for chaining.

##### `rLocation({ pathname }): Route`

Sets [`route.props.location`](https://reacttraining.com/react-router/web/api/Route/location-object) and returns updated object for chaining.

##### `rSensitive(Boolean): Route`

Sets [`route.props.sensitive`](https://reacttraining.com/react-router/web/api/Route/sensitive-bool) and returns updated object for chaining.

##### `rChildren(Function)`

Sets [`route.props.children`](https://reacttraining.com/react-router/web/api/Route/children-func) and returns updated object for chaining.

##### `rComponent(ReactComponent): Route`

Sets [`route.props.component`](https://reacttraining.com/react-router/web/api/Route/component) and returns updated object for chaining.

##### `rRender(Function): Route`

Sets [`route.props.render`](https://reacttraining.com/react-router/web/api/Route/render-func) and returns updated object for chaining.

##### `setRenderProps(Object): Route`

Sets `route.renderProps`. Extra properties passed to the [render](#rrenderfunction-route) of this route. When this is non empty [react router render](<(https://reacttraining.com/react-router/web/api/Route/render-func)>) property is always used.

##### `setSuffixes(Suffixes): Route`

Sets `route.suffixes`. Named paths appended to base, result used as value of `react-router/Route` `path` prop. Supports multiple suffixes each with unique keys.

##### `addSuffixes(Suffixes): Route`

Updates existing `route.suffixes` with one or more suffixes.

##### `removeSuffixes(...String): Route`

Updates existing `route.suffixes`, takes a list of names, used as keys to delete matching path suffixes. Returns updated object for chaining.

##### `setNestedProps(Object): Route`

Sets `route.nest.props`, optional base props passed to all children routes. This is equivalent to adding to the [`route.props`](#addpropsobject-route) of all nested `Route`.

##### `setNestedRenderProps(Object): Route`

Sets `route.nest.renderProps`, optional extra properties passed to the render of all children routes. This is equivalent to setting the [`route.renderProps`](#setRenderPropsobject-route) of all nested `Route`.

##### `setNestedRoutes(Route[]): Route`

Sets `route.nest.routes`, the list of children routes. Will generates `react-router/Route` for every base and suffix combination.

##### `addNestedRoutes(...Route): Route`

Updates `route.nest.routes`, adding any number of routes to the existing list of nested routes.

##### `removeNestedRoutes(...String): Route`

Updates `route.nest.routes`, taking a number of route names and removeing from list of routes. This only works on named nested routes.

##### `render(): ReactRouter.Route[]`

Generate and return all the `react-router/Route` components.

##### `describe(): RouteDirection`

Generate easily accessible directions to all named paths.

```ts
export type RouteDirection = {
    [$: string]: string;
};
```

#### Usage

See [example below](#example).

### The `Chart` Object

This is the library main export. See [example below for more detailed usage](#example).

#### Static Methods

Exposes two covenience methods, for initialising the rendering the route map.

##### `route(RouteShape)`

Create a Route object with the specified shape [(see shape above)](#shapes). Equivalent to calling `new Route(routeShape)`.

```js
const route = Chart.route({
    name: "base",
    props: {
        path: "/",
        component: App,
        strict: true,
    },
});

route.name;         // "base"
route.props;        // { path: "/", strict: true }
route.describe().$; // "/"
```

##### `render(Route):`

Renders a given route object. Equivalent to calling `route.render()`.

```js
Chart.render(route);
// generates
<Route path="/" component={App} strict />;
```

## Example

In route definition files

```js
import { Chart } from "react-router-chart";
```

Start charting routes

```js
const childRoute = Chart.route({
    props: { path: "/iam", component: ChildView, key: "a-child-view" },
    suffixes: { aChild: "/a/child" },
}).setRenderProps({ level: 2 });

const parentRoute = Chart.route({
    props: { exact: true, strict: true, component: BaseView },
    suffixes: { example: "/example/:id", demo: "/demo/:id" },
    renderProps: { highlight: true },
})
    .addNestedRoutes(childRoute)
    .setNestedProps({ exact: true, strict: true })
    .setNestedRenderProps({ highlight: true, level: 1 });

const baseRoute = Chart.route({
    name: "base",
    props: { path: "/mybase" },
    nest: { routes: [parentRoute] },
});
```

In main app with react router

```ml
<Switch>{ baseRoute.render() }</Switch>
```

Equivalent to

```ml
<Switch>
    <Route
        path="/mybase/example/:id"
        key="/mybase/example/:id"
        exact
        strict
        render={ props => <BaseView highlight=true {...props} /> }
    />
    <Route
        path="/mybase/demo/:id"
        exact
        strict
        render={ props => <BaseView highlight=true {...props} /> }
    />
    <Route
        path="/mybase/example/:id/iam/a/child"
        key="a-child-view.0"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 {...props} /> }
    />
    <Route
        path="/mybase/demo/:id/iam/a/child"
        key="a-child-view.1"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 {...props} /> }
    />
</Switch>
```

Get directions to all named routes

```js
const paths = route.describe();
```

Easily access location path

```js
paths.$;                // "/mybase"
paths.demo.$;           // "/mybase/demo/:id"
paths.example.$;        // "/mybase/example/:id"
paths.demo.aChild.$;    // "/mybase/demo/:id/iam/a/child"
paths.example.aChild.$; // "/mybase/example/:id/iam/a/child"
```

Can be used in snapshots to verify generated routes.
