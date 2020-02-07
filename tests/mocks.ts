import { RouteShape } from "global";
import { Route } from "route";

const component = jest.fn();

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

const MockRoute = (): Partial<Route> => ({
    render: jest.fn(),
});

export { MockRoute as Route };
