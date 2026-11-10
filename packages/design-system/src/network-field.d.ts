export interface FieldNode {
  x: number;
  y: number;
  r: number;
}

export interface FieldLink {
  a: FieldNode;
  b: FieldNode;
  /** Stroke opacity, 0–1. */
  o: number;
}

export interface NetworkField {
  width: number;
  height: number;
  nodes: FieldNode[];
  links: FieldLink[];
  /** Nodes of the attack path, in order. */
  path: FieldNode[];
  /** SVG path data for the attack path. */
  pathD: string;
  entry: FieldNode;
  target: FieldNode;
}

export const WIDTH: number;
export const HEIGHT: number;
export function createNetworkField(seed?: number): NetworkField;
