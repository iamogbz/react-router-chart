import Chart from "../chart";
import Route from "../route";

import mocks from "./mocks";

jest.mock("../route");

describe("Chart", () => {
    beforeEach(() => Route.mockClear());

    it("should create new Route", () => {
        Chart.route(mocks.routeShape);
        expect(Route).toBeCalledWith(mocks.routeShape);
    });

    it("should call route render", () => {
        Route.mockImplementation(mocks.Route);
        const route = Chart.route(mocks.routeShape);
        Chart.render(route);
        expect(route.render).toBeCalled();
    });
});
