import { Chart } from "./chart";
import { namedRoutes, routes } from "./chart.mocks";

describe("chart", () => {
    it("describes expected named routes", () => {
        const result = Chart.describe(...routes);
        expect(result).toEqual(namedRoutes);
    });
});
