import { Chart } from "chart";
import * as route from "route";
import { AnyObject } from "global";
import * as mocks from "./mocks";

describe("Chart", () => {
    beforeEach(jest.clearAllMocks);
    afterAll(jest.restoreAllMocks);

    it("should create new Route", () => {
        expect(Chart.route(mocks.routeShape)).toBeInstanceOf(route.Route);
    });

    it("should call route render", () => {
        const RouteSpy = jest
            .spyOn(route as AnyObject, "Route")
            .mockImplementation(mocks.Route);
        const newRoute = Chart.route(mocks.routeShape);
        Chart.render(newRoute);
        expect(newRoute.render).toBeCalled();
        RouteSpy.mockRestore();
    });
});
