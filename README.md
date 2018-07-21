# React Router Cartographer

Create a single source map of truth for all routes in your react app and easily render in react-router

## Shapes

### `Route`

```js
{
    name: string,
    props: {},
    renderProps: {},
    suffixes: [{ name: path }],
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
import chart from "react-cartographer";
```

#### .route(shape)

Create a route object with the specified shape (see shape above)

```js
const route = chart.route({
  name: "base",
  props: {
    component: App,
    strict: true
  }
});

route.name;              // "base"
route.props;             // { strict: true }
route.directions.base;   // "/"

route.render();
// generates
<Route path="/" component={App} strict />;
```

### Build Routes

These methods on the `route` return a reference to the updated object for easier mapping

#### `.setName(string) => route.name`

This is the value used for describing directions, therefore must be unique in the context of its parent route

#### `.setProps({}) => route.props`

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

List of paths appended to base, result used as `Route.path` prop

#### `.addSuffixes(...suffixes)`

Add one or more suffixes to existing `route.suffixes`

#### `.removeSuffixes(...names)`

Deletes specified suffixes using names as keys

#### `.setNestedProps() => route.nest.props`

Optional base props passed to all children routes

#### `.setNestedRenderProps() => route.nest.renderProps`

Optional extra properties passed to the render of all children routes

#### `.setNestedRoutes(...route) => route.nest.routes`

List of children routes, generates `react-router/Route` for each base \* suffixes

#### `.addRoutes(...route)`

Add single or multiple routes to the exisiting list

#### `.removeRoutes(...names)`

Remove from list of routes only works if nested routes were named

#### `.removeRoute(name, verify=false)`

Pass `true` to verify param to get result of operation instead of updated route object

### Render Map

Next we have the methods that generate the routes

```js
const childRoute = chart
  .route({
    props: { path: "/iam", component: ChildView, key: "a-child-view" },
    suffixes: [{ aChild: "/a/child" }]
  })
  .setRenderProps({ level: 2 });

const parentRoute = chart
  .route({
    props: { exact: true, strict: true, component: BaseView },
    suffixes: [{ example: "/example/:id" }, { demo: "/demo/:id" }],
    renderProps: { highlight: true }
  })
  .addRoutes(childRoute)
  .setNestedProps({ exact: true, strict: true })
  .setNestedRenderProps({ highlight: true, level: 1 });

const baseRoute = {
  name: "base",
  props: { path: "/mybase" },
  routes: [parentRoute]
};
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
paths.base.$;                  // "/base"
paths.base.demo.$;             // "/base/demo/:id"
paths.base.example.$;          // "/base/example/:id"
paths.base.demo.aChild.$;      // "/base/demo/:id/iam/a/child"
paths.base.example.aChild.$;   // "/base/example/:id/iam/a/child"
```
