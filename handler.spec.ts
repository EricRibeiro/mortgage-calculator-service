import { calculate } from "./handler";

describe("Test mortgage calculator", () => {
  it("should return 1", () => {
    expect(calculate()).toBe(1);
  });
})