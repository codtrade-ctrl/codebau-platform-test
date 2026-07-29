/**
 * Material Calculator Engine
 * Handles precise calculations for material consumption, package counts, purchased weight,
 * and estimated remainder without ambiguous formulations.
 */

export interface MaterialCalcResult {
  requiredWeightKg: number;
  packageSizeKg: number;
  purchasedPackagesCount: number;
  purchasedWeightKg: number;
  estimatedRemainderKg: number;
  totalCostMDL: number;
  unitPriceMDL: number;
}

export function calculateRequiredWeight(
  areaSqM: number,
  consumptionPerSqM: number = 4.5,
  wasteBufferPercent: number = 10,
  factorSize: number = 1.0
): number {
  if (isNaN(areaSqM) || areaSqM <= 0) return 0;
  const rawKg = areaSqM * consumptionPerSqM * factorSize;
  const withBuffer = rawKg * (1 + wasteBufferPercent / 100);
  return Math.round(withBuffer * 100) / 100;
}

export function calculateRequiredPackages(
  requiredWeightKg: number,
  packageSizeKg: number = 25
): number {
  if (requiredWeightKg <= 0 || packageSizeKg <= 0) return 0;
  return Math.ceil(requiredWeightKg / packageSizeKg);
}

export function calculatePurchasedWeight(
  packagesCount: number,
  packageSizeKg: number = 25
): number {
  if (packagesCount <= 0 || packageSizeKg <= 0) return 0;
  return packagesCount * packageSizeKg;
}

export function calculateEstimatedRemainder(
  purchasedWeightKg: number,
  requiredWeightKg: number
): number {
  if (purchasedWeightKg <= 0) return 0;
  const remainder = purchasedWeightKg - requiredWeightKg;
  return Math.max(0, Math.round(remainder * 100) / 100);
}

export function calculateMaterialCost(
  packagesCount: number,
  unitPriceMDL: number
): number {
  if (packagesCount <= 0 || unitPriceMDL <= 0) return 0;
  return Math.round(packagesCount * unitPriceMDL * 100) / 100;
}

export function runFullMaterialCalculation(
  areaSqM: number,
  consumptionPerSqM: number = 4.5,
  wasteBufferPercent: number = 10,
  packageSizeKg: number = 25,
  unitPriceMDL: number = 0,
  factorSize: number = 1.0
): MaterialCalcResult {
  const safeArea = Math.max(0, areaSqM || 0);
  const requiredWeightKg = calculateRequiredWeight(safeArea, consumptionPerSqM, wasteBufferPercent, factorSize);
  const purchasedPackagesCount = calculateRequiredPackages(requiredWeightKg, packageSizeKg);
  const purchasedWeightKg = calculatePurchasedWeight(purchasedPackagesCount, packageSizeKg);
  const estimatedRemainderKg = calculateEstimatedRemainder(purchasedWeightKg, requiredWeightKg);
  const totalCostMDL = calculateMaterialCost(purchasedPackagesCount, unitPriceMDL);

  return {
    requiredWeightKg,
    packageSizeKg,
    purchasedPackagesCount,
    purchasedWeightKg,
    estimatedRemainderKg,
    totalCostMDL,
    unitPriceMDL
  };
}
