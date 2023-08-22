# React Router Chart

Define your routes only once and reference for use everywhere.

[![NPM Version](https://img.shields.io/npm/v/react-router-chart.svg)](https://www.npmjs.com/package/react-router-chart)
[![Build Status](https://github.com/iamogbz/react-router-chart/workflows/Build/badge.svg)](https://github.com/iamogbz/react-router-chart/actions?query=workflow%3ABuild)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-router-chart/badge.svg?branch=main&cache=0)](https://coveralls.io/github/iamogbz/react-router-chart?branch=main)
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

## Usage

### React Router

You should understand what [`react-router`](https://reactrouter.com/en/main/routers/picking-a-router) provides out of the box.

The [`react-router/Route`](https://reactrouter.com/en/main/route/route) supports nesting
but does not provide an easy way to reference existing nested routes.

This is where [`Chart.describe`](#chartdescribe) is useful.

### `Chart.describe`

```js
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Chart } from 'react-router-chart`;
import Root, { rootLoader } from "./routes/root";
import Team, { teamLoader } from "./routes/team";

// Given a react router route config
const routeConfigs = [
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "team",
        element: <Team />,
        loader: teamLoader,
      },
    ],
  },
]

// Generate named route paths
export const paths = Chart.describe(routeConfigs);

export const router = createBrowserRouter(routeConfigs);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

Easily access any location path by name

```js
paths.$; // "/" - root
paths.team.$; // "/team" - team
```

Can be reference for link creation in other parts of the app.
