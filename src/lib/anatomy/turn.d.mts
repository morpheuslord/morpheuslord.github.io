// Minimal types for the anatomy turn runtime (turn.mjs).
export interface TurnController {
  set(values: Record<string, number> | number, options?: { detail?: number }): unknown;
  destroy(): void;
}
export const TURN: {
  mount(stage: Element, data: unknown, options?: { follow?: (v: Record<string, number>) => Record<string, number>; onHold?: () => void; onFrame?: (c: TurnController) => void }): TurnController;
};
export const TURN_CSS: string;
