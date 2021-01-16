import { Chart } from "index";

describe("Integration", () => {
    it("exports chart", () => {
        expect(Chart).toBeDefined();
        expect(typeof Chart.route).toBe("function");
        expect(typeof Chart.render).toBe("function");
    });
});
