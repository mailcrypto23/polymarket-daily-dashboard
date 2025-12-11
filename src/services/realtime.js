export function subscribeToPrice(callback) {
  // Fake mock price stream: updates every 2 seconds
  let price = 1000 + Math.random() * 50;

  const interval = setInterval(() => {
    price += (Math.random() - 0.5) * 5;
    callback(price.toFixed(2));
  }, 2000);

  return () => clearInterval(interval); // unsubscribe function
}
