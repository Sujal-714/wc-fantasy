
type ValidationResult = {
  valid: boolean
  error?: string
}

type Player = {
  id: string
  price: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  country: string
}

export function validateSquadComposition(dbPlayers: {
    id: string;
    price: string;
    position: string;
    country: string;
}[]): ValidationResult {
  // ... budget check
  // ... formation check  
  // ... country check
  // returns something — what should it return? true/false? an error message? 
  // ── Budget check ────────────────────────────────────────
  const totalCost = dbPlayers.reduce((sum: number, p: any) => sum + parseFloat(p.price), 0)
  if (totalCost > 120) {
    return {valid: false, error: `Squad costs $${totalCost.toFixed(1)}, exceeds $120 budget`}
  }

  // ── Position check ──────────────────────────────────────
  const positions: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 }
  for (const p of dbPlayers) positions[p.position]++

  if (positions.GK !== 2 || positions.DEF !== 5 || positions.MID !== 5 || positions.FWD !== 3) {

    return {valid: false, error: `Invalid formation. Need 2 GK, 5 DEF, 5 MID, 3 FWD`}
  }

  // ── Country limit check ─────────────────────────────────
  const countryCounts: Record<string, number> = {}
  for (const p of dbPlayers) {
    countryCounts[p.country] = (countryCounts[p.country] || 0) + 1
    if (countryCounts[p.country] > 3) {
      return {valid: false, error: `Max 3 players allowed from ${p.country}`}
    }
  }
  return {valid: true}
}

