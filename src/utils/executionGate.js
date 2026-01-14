export const EXECUTION_ENABLED = false;

export function assertReadOnly(moduleName) {
  if (EXECUTION_ENABLED) return;

  throw new Error(
    `[READ-ONLY MODE] ${moduleName} attempted execution. 
     Execution is disabled until Polymarket API approval.`
  );
}
