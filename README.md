# React Router Cartographer

Easily create single source map of truth for all routes in your react app

## Shape

```js
Route {
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

### Chart

#### Import

```js
import { chart } from "react-cartographer";
```

Simple usage

```js
const route = chart.route({
  name: "base",
  props: {
    component: App,
    strict: true
  }
});

console.log(route.name); // 'base'
console.log(route.props); // { strict: true }
console.log(route.directions.base); // '/'

chart.render(route);
// generates
<Route path="/" component={App} strict />;
```

#### Methods

##### .route(shape)

Create a route object with the specified shape (see shape above)

##### .render(route)

Renders a Route object as `react-router/Route` components

Alternatively use `route.render()` which call this function on itself

---

#### `Route`

These methods return a reference to route object for easier mapping

##### `.setName(string) => route.name`

This is the value used for describing directions, therefore must be unique in the context of it's parent route

##### `.setProps({}) => route.props`

Accepts all `react-router/Route` props, using `path` as the `base` for suffixes

##### `.rPath(string) => route.props.path`

##### `.rkey(string) => route.props.key`

##### `.rExact(boolean) => route.props.exact`

##### `.rStrict(boolean) => route.props.strict`

##### `.rLocation({ pathname: string }) => route.props.location`

##### `.rSensitive(boolean) => route.props.sensitive`

##### `.rChildren(function() {}) => route.props.children`

##### `.rComponent(ReactComponent) => route.props.component`

##### `.rRender(function() {}) => route.props.render`

> see [`react-router`](https://reacttraining.com/react-router/web/api/Route/component) for more description of above properties

##### `.setRenderProps() => route.renderProps`

Extra properties passed to the render of this route. When this is non empty react router render property is always used

##### `.setSuffixes({}) => route.suffixes`

List of paths appended to base, result used as `react-router/Route.path` prop

##### `.addSuffixes(...suffixes)`

Add one or more suffixes to existing `route.suffixes`

##### `.removeSuffixes(...names)`

Deletes specified suffixes using names as keys

##### `.setNestedProps() => route.nest.props`

Optional base props passed to all children routes

##### `.setNestedRenderProps() => route.nest.renderProps`

Optional extra properties passed to the render of all children routes

##### `.setNestedRoutes(...route) => route.nest.routes`

List of children routes, generates `react-router/Route` for each base * suffixes

##### `.addRoutes(...route)`

Add single or multiple routes to the exisiting list

##### `.removeRoutes(...names)`

Remove from list of routes only works if nested routes were named

##### `.removeRoute(name: string, ...{ verify: boolean })`

Use verify to return result of operation instead of updated route object

---

Next we have the methods that generate the routes

```js
const childRoute = chart.route({
    props: { path: '/iam', component: ChildView, key: 'a-child-view' },
    suffixes: [{'aChild': '/a/child'}],
}).setRenderProps({ level: 2 })

const parentRoute = chart.route({
    props: { exact: true, strict: true, component: BaseView },
    suffixes: [{ example: '/example/\\d+'}, { demo: '/demo/\\d+'}],
    renderProps: { highlight : true },
})
.addRoutes(childRoute)
.setNestedProps({ exact: true, strict: true })
.setNestedRenderProps({ highlight: true, level: 1 })

const baseRoute = {
    name: 'base',
    props: { path: '/mybase' },
    routes: [parentRoute],
}
```

##### `.render()`

Map and render all the `react-route/Route` components

```ml
<Switch>{ baseRoute.render() }</Switch>
```

```ml
<Switch>
    <Route
        path="/mybase/example/\\d+"
        exact
        strict
        render={ props => <BaseView highlight=true /> }
    />
    <Route
        path="/mybase/demo/\\d+/"
        exact
        strict
        render={ props => <BaseView highlight=true /> }
    />
    <Route
        path="/mybase/example/\\d+/iam/a/child"
        key="a-child-view.0"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 /> }
    />
    <Route
        path="/mybase/demo/\\d+/iam/a/child"
        key="a-child-view.1"
        exact
        strict
        render={ props => <ChildView highlight=true level=2 /> }
    />
</Switch>
```

##### `.describe()`

Generate easily accessible description of all named routes

```js

```
