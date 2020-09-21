import * as util from './util'
import * as cg from './types'

type Mobility = (x1: number, y1: number, x2: number, y2: number) => boolean;

const bPalace = [
  [4, 10], [5, 10], [6, 10],
  [4, 9], [5, 9], [6, 9],
  [4, 8], [5, 8], [6, 8],
];
const wPalace = [
  [4, 3], [5, 3], [6, 3],
  [4, 2], [5, 2], [6, 2],
  [4, 1], [5, 1], [6, 1],
];

function diff(a: number, b: number): number {
  return Math.abs(a - b);
}

function pawn(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => (
    (x2 === x1 && (color === 'white' ? y2 === y1 + 1 : y2 === y1 - 1)) ||
    (y2 === y1 && (x2 === x1 + 1 || x2 === x1 - 1) && (color === 'white' ? y1 > 5 : y1 < 6))
    );
}

export const knight: Mobility = (x1, y1, x2, y2) => {
  const xd = diff(x1, x2);
  const yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
}

function bishop(color: cg.Color): Mobility {
  return (x1, y1, x2, y2) => (
    diff(x1, x2) === diff(y1, y2) && diff(x1, x2) === 2 && (color === 'white' ? y2 < 6 : y2 > 5)
    );
}

const rook: Mobility = (x1, y1, x2, y2) => {
  return x1 === x2 || y1 === y2;
}

export function advisor(color: cg.Color): Mobility {
  const palace = (color == 'white') ? wPalace : bPalace;
  return (x1, y1, x2, y2) => (
      diff(x1, x2) === diff(y1, y2) && diff(x1, x2) === 1 && palace.some(point => (point[0] === x2 && point[1] === y2))
  );
}

function king(color: cg.Color): Mobility {
  const palace = (color == 'white') ? wPalace :bPalace;
  return (x1, y1, x2, y2) => (
      ((x1 === x2 && diff(y1, y2) === 1) || (y1 === y2 && diff(x1, x2) === 1)) && palace.some(point => (point[0] === x2 && point[1] === y2))
  );
}

// function rookFilesOf(pieces: cg.Pieces, color: cg.Color) {
//   const backrank = color === 'white' ? '1' : '8';
//   const files = [];
//   for (const [key, piece] of pieces) {
//     if (key[1] === backrank && piece.color === color && piece.role === 'rook') {
//       files.push(util.key2pos(key)[0]);
//     }
//   }
//   return files;
// }

export function premove(pieces: cg.Pieces, key: cg.Key): cg.Key[] {
  const piece = pieces.get(key);
  if (!piece) return [];
  const pos = util.key2pos(key),
    r = piece.role,
    mobility: Mobility = r === 'pawn' ? pawn(piece.color) : (
      r === 'knight' ? knight : (
        r === 'bishop' ? bishop(piece.color) : (
          r === 'rook' ? rook : (
            r === 'cannon' ? rook : (
              r === 'advisor' ? advisor(piece.color) : king(piece.color)
          )))));
  return util.allPos.filter(pos2 =>
    (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1])
  ).map(util.pos2key);
}
