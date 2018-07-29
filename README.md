# React Router Chart

Create a single source map of truth for all routes in your react app and easily render in react-router

[![Build Status](https://travis-ci.org/iamogbz/react-router-chart.svg?branch=master)](https://travis-ci.org/iamogbz/react-router-chart?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-router-chart/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/react-router-chart?branch=master)
![Dependencies](https://david-dm.org/iamogbz/react-router-chart.svg)

## Shapes

### `Route`

```js
{
    name: string,
    props: {},
    renderProps: {},
    suffixes: { name: path },
    nest: {
        props: {},
        renderProps: {},
        routes: [Route],
    }
}
```

## API

### Start Chart

```js
import chart from "react-router-chart";
```

#### `.route(shape)`

Create a route object with the specified shape (see shape above)

```js
const route = chart.route({
  name: "base",
  props: {
    path: "/",
    component: App,
    strict: true
  }
});

route.name;              // "base"
route.props;             // { path: "/", strict: true }
route.describe().base.$;   // ""

route.render();
// generates
<Route path="/" component={App} strict />;
```

### Build Routes

These methods on the `route` return a reference to the updated object for easier mapping

#### `.setName(string) => route.name`

This is the value used for describing directions, therefore must be unique in the context of its parent route

#### `.addProps({}) => route.props`

Accepts all `react-router/Route` props, using `path` as the `base` for suffixes

#### `.rPath(string) => route.props.path`

#### `.rkey(string) => route.props.key`

#### `.rExact(boolean) => route.props.exact`

#### `.rStrict(boolean) => route.props.strict`

#### `.rLocation({ pathname }) => route.props.location`

#### `.rSensitive(boolean) => route.props.sensitive`

#### `.rChildren(() => {}) => route.props.children`

#### `.rComponent(ReactComponent) => route.props.component`

#### `.rRender(() => {}) => route.props.render`

> see [`react-router`](https://reacttraining.com/react-router/web/api/Route/component) for more description of the above properties

#### `.setRenderProps() => route.renderProps`

Extra properties passed to the render of this route. When this is non empty react router render property is always used

#### `.setSuffixes() => route.suffixes`

Named paths appended to base, result used as `Route.path` prop

#### `.addSuffixes(...suffixes)`

Add one or more suffixes to existing `route.suffixes`

#### `.removeSuffixes(...names)`

Deletes specified suffixes using names as keys

#### `.setNestedProps() => route.nest.props`

Optional base props passed to all children routes

#### `.setNestedRenderProps() => route.nest.renderProps`

Optional extra properties passed to the render of all children routes

#### `.setNestedRoutes() => route.nest.routes`

List of children routes, generates `react-router/Route` for each base \* suffixes

#### `.addNestedRoutes(...routes)`

Add single or multiple routes to the existing list of nested routes

#### `.removeNestedRoutes(...names)`

Remove from list of routes only works if nested routes were named

### Render Map

Next we have the methods that generate the routes

```js
const childRoute = chart
  .route({
    props: { path: "/iam", component: ChildView, key: "a-child-view" },
    suffixes: { aChild: "/a/child" }
  })
  .setRenderProps({ level: 2 });

const parentRoute = chart
  .route({
    props: { exact: true, strict: true, component: BaseView },
    suffixes: { example: "/example/:id", demo: "/demo/:id" },
    renderProps: { highlight: true }
  })
  .addNestedRoutes(childRoute)
  .setNestedProps({ exact: true, strict: true })
  .setNestedRenderProps({ highlight: true, level: 1 });

const baseRoute = chart.route({
  name: "base",
  props: { path: "/mybase" },
  nest: { routes: [parentRoute] },
});
```

#### `.render()`

Build and return all the `react-router/Route` components

```ml
<Switch>{ baseRoute.render() }</Switch>
```

```ml
<Switch>
    <Route
        path="/mybase/example/:id"
        key="/mybase/example/:id"
        exact
        strict
        render={ props => <BaseView highlight=true /> }
    />
    <Route
        path="/mybase/demo/:id"
        key="/mybase/demo/:id"
        exact
        strict
        render={ props => <BaseView highlight=true /> }
    />
    <Route
        path="/mybase/example/:id/iam/a/child"
        key="a-child-view.0"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 /> }
    />
    <Route
        path="/mybase/demo/:id/iam/a/child"
        key="a-child-view.1"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 /> }
    />
</Switch>
```

#### `.describe()`

Generate easily accessible directions to all named paths

```js
const paths = route.describe();
```

```js
paths.$;                  // "/mybase"
paths.demo.$;             // "/mybase/demo/:id"
paths.example.$;          // "/mybase/example/:id"
paths.demo.aChild.$;      // "/mybase/demo/:id/iam/a/child"
paths.example.aChild.$;   // "/mybase/example/:id/iam/a/child"
```
