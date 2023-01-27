export function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}
