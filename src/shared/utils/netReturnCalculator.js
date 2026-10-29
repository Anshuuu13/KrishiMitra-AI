/**
 * Net Return Calculator Core Logic
 * 
 * Formula:
 * Gross Revenue = Offered Price * Quantity
 * Total Deductions = Transport + Handling (Loading/Unloading) + Mandi Cess/Fee + Other Costs
 * Net Return = Gross Revenue - Total Deductions
 * Net Per Quintal = Net Return / Quantity
 */

export function calculateNetReturn({
  pricePerQuintal = 0,
  quantityQuintals = 0,
  distanceKm = 0,
  transportCostPerKm = 0,
  flatTransportCost = null,
  loadingPerQuintal = 15,
  unloadingPerQuintal = 15,
  mandiFeePercent = 0,
  otherDeductions = 0,
}) {
  const price = Math.max(0, Number(pricePerQuintal) || 0);
  const qty = Math.max(0, Number(quantityQuintals) || 0);
  const dist = Math.max(0, Number(distanceKm) || 0);
  const perKm = Math.max(0, Number(transportCostPerKm) || 0);
  const loadCost = Math.max(0, Number(loadingPerQuintal) || 0);
  const unloadCost = Math.max(0, Number(unloadingPerQuintal) || 0);
  const feePct = Math.max(0, Number(mandiFeePercent) || 0);
  const other = Math.max(0, Number(otherDeductions) || 0);

  const grossRevenue = price * qty;

  // Transport cost: use flat cost if provided, otherwise compute from distance * perKmRate
  const transportCost = flatTransportCost !== null && flatTransportCost !== undefined
    ? Math.max(0, Number(flatTransportCost) || 0)
    : dist * perKm;

  const handlingCost = (loadCost + unloadCost) * qty;
  const mandiFee = (grossRevenue * feePct) / 100;
  const totalDeductions = transportCost + handlingCost + mandiFee + other;
  const estimatedNetReturn = grossRevenue - totalDeductions;
  const netPricePerQuintal = qty > 0 ? (estimatedNetReturn / qty) : 0;

  return {
    grossRevenue,
    transportCost,
    handlingCost,
    mandiFee,
    otherDeductions: other,
    totalDeductions,
    estimatedNetReturn,
    netPricePerQuintal: Math.round(netPricePerQuintal * 100) / 100,
    formulaExplanation: `(Price ₹${price} × ${qty} quintals) - (Transport ₹${transportCost} + Handling ₹${handlingCost} + Mandi Fee ₹${Math.round(mandiFee)} + Other ₹${other})`,
  };
}
