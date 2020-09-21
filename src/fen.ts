import { pos2key, invRanks } from './util'
import * as cg from './types'

export const initial: cg.FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w';
const roles: { [letter: string]: cg.Role } = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', a: 'advisor', c: 'cannon', k: 'king' };

const letters = { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', advisor: 'a', cannon: 'c', king: 'k' };

export function read(fen: cg.FEN): cg.Pieces {
  if (fen === 'start') fen = initial;
  if (fen.indexOf('[') !== -1) fen = fen.slice(0, fen.indexOf('['));
  const pieces: cg.Pieces = new Map();
  let row: number = fen.split("/").length;
  let col: number = 0;

  for (const c of fen) {
    switch (c) {
      case ' ': 
        return pieces;
      case '/':
        --row;
        if (row === 0) return pieces;
        col = 0;
        break;
      case '~':
        // const piece = pieces.get(pos2key([col, row]));
        break;
      default:
        const nb = c.charCodeAt(0);
        
        if (nb < 58) {
          col += (c === '0') ? 9 : nb - 48;
        }
        else {
          ++col;
          const role = c.toLowerCase();
          
          let piece = {
            role: roles[role],
            color: (c === role ? 'black' : 'white') as cg.Color
          } as cg.Piece;
          
          pieces.set(pos2key([col, row]), piece);
        }
    }
  }
  return pieces;
}

export function write(pieces: cg.Pieces): cg.FEN {
  return invRanks.map(y => cg.files.map(x => {
      const piece = pieces.get(x + y as cg.Key);
      if (piece) {
        const letter = letters[piece.role];
        return piece.color === 'white' ? letter.toUpperCase() : letter;
      } else return '1';
    }).join('')
  ).join('/').replace(/1{2,}/g, s => s.length.toString());
}
