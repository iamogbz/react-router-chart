import { Chart } from "index";

describe("Index", () => {
    it("exports chart", () => {
        expect(Chart).toBeDefined();
        expect(typeof Chart.route).toBe("function");
        expect(typeof Chart.render).toBe("function");
    });
});
