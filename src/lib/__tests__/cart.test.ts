import { describe, expect, it } from "vitest";
import { cartCount, cartReducer, cartTotal, type CartItem } from "../cart";

const base: Omit<CartItem, "quantity"> = {
  productId: "p1",
  name: "Remera oversize negra",
  size: "M",
  unitPrice: 15000,
  image: "",
};

describe("cartReducer", () => {
  it("adds a new item", () => {
    const next = cartReducer([], { type: "add", item: base });
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ ...base, quantity: 1 });
  });

  it("merges the same product and size instead of duplicating", () => {
    const state = cartReducer([], { type: "add", item: base, quantity: 2 });
    const next = cartReducer(state, { type: "add", item: base });
    expect(next).toHaveLength(1);
    expect(next[0].quantity).toBe(3);
  });

  it("keeps different sizes of the same product as separate items", () => {
    let state = cartReducer([], { type: "add", item: base });
    state = cartReducer(state, { type: "add", item: { ...base, size: "L" } });
    expect(state).toHaveLength(2);
  });

  it("updates quantity and removes the item when it reaches zero", () => {
    let state = cartReducer([], { type: "add", item: base, quantity: 2 });
    state = cartReducer(state, { type: "setQuantity", productId: "p1", size: "M", quantity: 5 });
    expect(state[0].quantity).toBe(5);
    state = cartReducer(state, { type: "setQuantity", productId: "p1", size: "M", quantity: 0 });
    expect(state).toHaveLength(0);
  });

  it("clears the cart", () => {
    const state = cartReducer([], { type: "add", item: base });
    expect(cartReducer(state, { type: "clear" })).toEqual([]);
  });
});

describe("cart totals", () => {
  it("sums quantities and prices", () => {
    let state = cartReducer([], { type: "add", item: base, quantity: 2 });
    state = cartReducer(state, {
      type: "add",
      item: { ...base, productId: "p2", size: null, unitPrice: 32000 },
    });
    expect(cartCount(state)).toBe(3);
    expect(cartTotal(state)).toBe(62000);
  });
});
