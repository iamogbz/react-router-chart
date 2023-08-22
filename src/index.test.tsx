import * as chart from ".";

describe("index", () => {
    it("exports expected values", () => {
        expect(chart).toMatchSnapshot();
    });
});
