export interface CartItem {
  productId: string;
  name: string;
  size: string | null;
  unitPrice: number;
  quantity: number;
  image: string;
}

export type CartAction =
  | { type: "add"; item: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "remove"; productId: string; size: string | null }
  | { type: "setQuantity"; productId: string; size: string | null; quantity: number }
  | { type: "clear" };

export function cartKey(productId: string, size: string | null): string {
  return `${productId}::${size ?? ""}`;
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const quantity = action.quantity ?? 1;
      const existing = state.find(
        (item) => cartKey(item.productId, item.size) === cartKey(action.item.productId, action.item.size),
      );
      if (existing) {
        return state.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...state, { ...action.item, quantity }];
    }
    case "remove":
      return state.filter(
        (item) => cartKey(item.productId, item.size) !== cartKey(action.productId, action.size),
      );
    case "setQuantity": {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: "remove", productId: action.productId, size: action.size });
      }
      return state.map((item) =>
        cartKey(item.productId, item.size) === cartKey(action.productId, action.size)
          ? { ...item, quantity: action.quantity }
          : item,
      );
    }
    case "clear":
      return [];
  }
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
