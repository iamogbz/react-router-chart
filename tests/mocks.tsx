import * as React from "react";
import { RouteShape } from "global";
import { Route } from "route";

const component = jest.fn(() =>
    React.createElement("div", { id: "test-element" }),
);

export const routeShape: RouteShape = {
    name: "base",
    props: {
        component,
        path: "",
        strict: true,
    },
    nest: {
        props: { exact: true },
        routes: [
            {
                name: "twin",
                props: { component, path: "/twin" },
                renderProps: { mockKey: "mockValue" },
                suffixes: { first: "-one", second: "-two" },
            },
            {
                name: "son",
                props: { path: "/child/son", render: jest.fn() },
                nest: {},
            },
            {
                props: { component, path: "" },
                suffixes: { nonentity: "" },
            },
            { props: { path: "/anonymous" } },
        ],
    },
};

const MockRoute = (): Route =>
    (({ render: jest.fn() } as Partial<Route>) as Route);

export { MockRoute as Route };
