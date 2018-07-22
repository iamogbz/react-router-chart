import chart from "../index";

describe("Root", () => {
    it("exports chart as default", () => {
        expect(chart).toBeDefined();
        expect(chart.route()).toBeDefined();
    });
});
