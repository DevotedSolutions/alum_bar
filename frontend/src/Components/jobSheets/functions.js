export function calculateOptimizedSheet(items) {
  // Total length calculation
  const totalLength = items.reduce(
    (sum, item) => sum + item.length * item.quantity,
    0
  );

  // Number of bars required (simplified logic for demo)
  const bars = items.map((item) => ({
    quantity: item.quantity,
    length: item.length,
  }));

  // Calculate wastage (for demo, just a random number)
  const wastage = (Math.random() * 5).toFixed(2);

  return {
    num: items.length, // Number of distinct items
    total: totalLength, // Total length of all items
    wastage: parseFloat(wastage), // Wastage percentage
    bars: bars, // Details of each bar
  };
}

export function getOptimizedSheets(data) {
  const groupedByCode = data.reduce((acc, item) => {
    if (!acc[item.code]) acc[item.code] = [];
    acc[item.code].push(item);
    return acc;
  }, {});

  const result = Object.keys(groupedByCode).map((code) => ({
    code,
    optimizedSheet: calculateOptimizedSheet(groupedByCode[code]),
  }));

  return result;
}
