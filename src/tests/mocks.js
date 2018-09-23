const component = () => {};

const routeShape = {
    name: "base",
    props: {
        component,
        path: "/parent",
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
        ],
    },
};

const Route = () => ({
    render: jest.fn(),
});

export default {
    Route,
    routeShape,
};
