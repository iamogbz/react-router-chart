import { $, $$, Chart } from "./chart";
import { namedRoutes, routes } from "./chart.mock";

describe("chart", () => {
    it("describes expected named routes", () => {
        const result = Chart.describe(...routes);
        expect(result).toEqual(namedRoutes);
        expect(result[Chart.ROOT][$]).toEqual("/");
        expect(result[Chart.ROOT][$$]).toEqual("/home");
    });
});
