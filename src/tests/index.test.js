import chart from "../index";

describe("Index", () => {
    it("exports chart as default", () => {
        expect(chart).toBeDefined();
        expect(typeof chart.route).toBe("function");
        expect(typeof chart.render).toBe("function");
    });
});
