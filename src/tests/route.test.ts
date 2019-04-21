import { shallow } from "enzyme";
import { AnyObject, RouteShape } from "global";
import { Route } from "route";
import * as mocks from "./mocks";

const NOOP = () => {};

describe("Route", () => {
    let route: Route & AnyObject;

    beforeEach(() => {
        route = new Route(mocks.routeShape);
    });

    describe("initialization", () => {
        it("should use string value of name", () => {
            const mockName = "mockName";
            const name = { toString: () => mockName };
            route = new Route({ name } as RouteShape);
            expect(route.name).toEqual(mockName);
        });
        it("should initialize to empty nest", () => {
            route = new Route();
            expect(route.nest).toEqual({
                props: {},
                renderProps: {},
                routes: [],
            });
        });
    });

    describe("setName", () => {
        it("should set name and return route", () => {
            const mockName = "mock-name";
            expect(route.setName(mockName)).toBe(route);
            expect(route.name).toEqual(mockName);
        });
    });

    describe("setProps", () => {
        it("should set props and return route", () => {
            const mockProps = mocks.routeShape.nest.props;
            expect(route.setProps(mockProps)).toBe(route);
            expect(route.props).toEqual(mockProps);
        });

        it("should add props and return route", () => {
            const mockProps = mocks.routeShape.nest.props;
            expect(route.addProps(mockProps)).toBe(route);
            expect(route.props).toMatchObject(mockProps);
        });

        it("should call addProps", () => {
            const addPropsSpy = jest.spyOn(route, "addProps");
            Object.entries({
                children: NOOP,
                component: NOOP,
                exact: false,
                key: "mock-key",
                location: { pathname: "/mock/pathname" },
                path: "/mock/path",
                render: NOOP,
                sensitive: true,
                strict: true,
            }).forEach(([key, value]) => {
                const method = `r${key[0].toUpperCase()}${key.substring(1)}`;
                route[method](value);
                expect(addPropsSpy).toBeCalledWith({ [key]: value });
                addPropsSpy.mockReset();
            });
        });
    });

    describe("setRenderProps", () => {
        it("should assign renderProps and return route", () => {
            const mockRenderProps = { mockKey: "mockValue" };
            expect(route.setRenderProps(mockRenderProps)).toBe(route);
            expect(route.renderProps).toEqual(mockRenderProps);
        });
    });

    describe("setSuffixes", () => {
        it("should assign suffixes and return route", () => {
            const mockSuffixes = { mockName: "mockPath" };
            expect(route.setSuffixes(mockSuffixes)).toBe(route);
            expect(route.suffixes).toEqual(mockSuffixes);
        });

        it("should append suffixes and return route", () => {
            const mockSuffixes = { mockName: "/mockPath" };
            expect(route.addSuffixes(mockSuffixes)).toBe(route);
            expect(route.suffixes).toEqual(mockSuffixes);
            const extraSuffixes = { extraKey: "/another/path" };
            route.addSuffixes(extraSuffixes);
            expect(route.suffixes).toEqual({
                ...mockSuffixes,
                ...extraSuffixes,
            });
        });

        it("should remove suffixes and return route", () => {
            const mockSuffixes = {
                mockName: "/mockPath",
                extraKey: "/another/path",
            };
            route.setSuffixes(mockSuffixes);
            expect(route.suffixes).toEqual(mockSuffixes);
            expect(route.removeSuffixes("mockName")).toBe(route);
            expect(route.suffixes).toEqual({ extraKey: "/another/path" });
        });
    });

    describe("setNestedProps", () => {
        it("should assign nest props and return route", () => {
            const mockNestProps = mocks.routeShape.props;
            expect(route.setNestedProps(mockNestProps)).toBe(route);
            expect(route.nest.props).toEqual(mockNestProps);
        });
    });

    describe("setNestedRenderProps", () => {
        it("should assign nest renderProps and return route", () => {
            const mockNestRenderProps = mocks.routeShape.renderProps;
            expect(route.setNestedRenderProps(mockNestRenderProps)).toBe(route);
            expect(route.nest.renderProps).toEqual(mockNestRenderProps);
        });
    });

    describe("setNestedRoutes", () => {
        it("should assign nest routes and return route", () => {
            route.nest.routes = [];
            const mockNestedRoutes = mocks.routeShape.nest.routes;
            const mockRoutes = mockNestedRoutes.map(shape => new Route(shape));
            expect(route.setNestedRoutes(mockRoutes)).toBe(route);
            expect(route.nest.routes).toEqual(mockRoutes);
        });

        it("should append nest routes and return route", () => {
            const extraRoute = new Route({ props: { path: "/mockPath" } });
            expect(route.addNestedRoutes(extraRoute)).toBe(route);
            expect(route.nest.routes).toContain(extraRoute);
        });

        it("should remove nest routes and return route", () => {
            const extraRoute = new Route({ props: { path: "/mockPath" } });
            route.addNestedRoutes(extraRoute);
            const numNestedRoutes = route.nest.routes.length;
            expect(route.removeNestedRoutes("twin", "son")).toBe(route);
            expect(route.nest.routes).toContain(extraRoute);
            expect(route.nest.routes.length).toBe(numNestedRoutes - 2);
        });
    });

    describe("render", () => {
        const mockProps = {
            mockProp: "mock-value",
            path: "/mock-path",
        };
        const mockRenderProps = { mockRenderProp: "mock-render-value" };
        const newMockRoute = (props = {}, renderProps = {}) =>
            new Route({
                props: { ...mockProps, ...props },
                renderProps,
            });

        it("should match snapshot", () => {
            expect(route.render()).toMatchSnapshot();
        });

        it("should use react route render with component when render props set", () => {
            const component = jest.fn(NOOP);
            const mockRoute = newMockRoute({ component }, mockRenderProps);
            const reactRoute = mockRoute.render().pop();
            expect(reactRoute.props.component).toBeUndefined();
            shallow(reactRoute.props.render());
            expect(component).toBeCalledWith(mockRenderProps, {});
        });

        it("should use render with render fn when render props set", () => {
            const render = jest.fn();
            const mockRoute = newMockRoute({ render }, mockRenderProps);
            const reactRoute = mockRoute.render().pop();
            expect(reactRoute.props.component).toBeUndefined();
            reactRoute.props.render();
            expect(render).toBeCalledWith(mockRenderProps);
        });

        it("should render nothing when no render fn", () => {
            const mockRoute = newMockRoute({}, mockRenderProps);
            expect(mockRoute.render().pop()).toBeUndefined();
        });

        it("should use component over render and children", () => {
            const component = jest.fn(NOOP);
            const render = jest.fn();
            const children = jest.fn();
            const mockRoute = newMockRoute({
                component,
                render,
                children,
            });
            const reactRoute = mockRoute.render().pop();
            expect(reactRoute).toMatchSnapshot();
        });

        it("should use render over children", () => {
            const render = jest.fn();
            const children = jest.fn();
            const mockRoute = newMockRoute({
                render,
                children,
            });
            const reactRoute = mockRoute.render().pop();
            expect(reactRoute).toMatchSnapshot();
        });

        it("should use children if nothing else", () => {
            const children = jest.fn();
            const mockRoute = newMockRoute({ children });
            const reactRoute = mockRoute.render().pop();
            expect(reactRoute).toMatchSnapshot();
        });
    });

    describe("describe", () =>
        it("should match snapshot", () =>
            expect(route.describe()).toMatchSnapshot()));
});
