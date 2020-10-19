import * as cg from './types';

export const invRanks: readonly cg.Rank[] = [...cg.ranks].reverse();

export const allKeys: readonly cg.Key[] = Array.prototype.concat(...cg.files.map(c => cg.ranks.map(r => c + r)));


export function pos2key(pos: cg.Pos) {
  const bd = {width: 9, height: 10}
  return allKeys[bd.height * pos[0] + pos[1] - bd.height - 1];
}

export function key2pos(k: cg.Key) {
  const shift = 1 //first rank is 0
  return [k.charCodeAt(0) - 96, k.charCodeAt(1) - 48 + shift] as cg.Pos;
}

export const allPos: readonly cg.Pos[] = allKeys.map(key2pos);

export function memo<A>(f: () => A): cg.Memo<A> {
  let v: A | undefined;
  const ret = (): A => {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = () => { v = undefined };
  return ret;
}

export const timer = (): cg.Timer => {
  let startAt: number | undefined;
  return {
    start() { startAt = performance.now() },
    cancel() { startAt = undefined },
    stop() {
      if (!startAt) return 0;
      const time = performance.now() - startAt;
      startAt = undefined;
      return time;
    }
  };
}
export function containsX<X>(xs: X[] | undefined, x: X): boolean {
  return xs !== undefined && xs.indexOf(x) !== -1;
}

export const opposite = (c: cg.Color): cg.Color => c === 'white' ? 'black' : 'white';

export const distanceSq = (pos1: cg.Pos, pos2: cg.Pos): number => {
  const dx = pos1[0] - pos2[0],
  dy = pos1[1] - pos2[1];
  return dx * dx + dy * dy;
}

export const samePiece = (p1: cg.Piece, p2: cg.Piece): boolean =>
  p1.role === p2.role && p1.color === p2.color;

const posToTranslateBase = (pos: cg.Pos, asWhite: boolean, xFactor: number, yFactor: number): cg.NumberPair => {// ])
  return [
    (asWhite ? pos[0] - 1 : 9 - pos[0]) * xFactor,
  (asWhite ? 10 - pos[1]: pos[1] - 1) * yFactor
];
}

export const posToTranslateAbs = (bounds: ClientRect): (pos: cg.Pos, asWhite: boolean) => cg.NumberPair => {
  const xFactor = bounds.width / 9,
  yFactor = bounds.height / 10;
  return (pos, asWhite) => posToTranslateBase(pos, asWhite, xFactor, yFactor);
}

export const posToTranslateRel = (pos: cg.Pos, asWhite: boolean): cg.NumberPair =>
{
  return posToTranslateBase(pos, asWhite, 100, 100);
}

export const translateAbs = (el: HTMLElement, pos: cg.NumberPair): void => {
  el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
}

export const translateRel = (el: HTMLElement, percents: cg.NumberPair): void => {
  el.style.transform = `translate(${percents[0]}%,${percents[1]}%)`;
}

export const setVisible = (el: HTMLElement, v: boolean): void => {
  el.style.visibility = v ? 'visible' : 'hidden';
}

export const eventPosition = (e: cg.MouchEvent): cg.NumberPair | undefined => {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY!];
  if (e.targetTouches?.[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
  return; // touchend has no position!
}

export const isRightButton = (e: cg.MouchEvent): boolean => e.buttons === 2 || e.button === 2;

export const createEl = (tagName: string, className?: string): HTMLElement => {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  return el;
}

export function computeSquareCenter(key: cg.Key, asWhite: boolean, bounds: ClientRect): cg.NumberPair {
  const pos = key2pos(key);
  if (!asWhite) {
    pos[0] = 9 - pos[0];
    pos[1] = 10 - pos[1];
  }
  return [
    bounds.left + bounds.width * pos[0] / 9 + bounds.width / 16,
    bounds.top + bounds.height * (9 - pos[1]) / 10 + bounds.height / 16
  ];
}