const chessBoard = document.getElementById('board');

const BOARD_SIZE = 8;
const BASE_PATH = './public/';

const PATH = {
  ROOK: {
    BLACK: 'br.png',
    WHITE: 'wr.png',
  },
  PAWN: {
    BLACK: 'bp.png',
    WHITE: 'wp.png',
  },
  BISHOP: {
    BLACK: 'bb.png',
    WHITE: 'wb.png',
  },
  QUEEN: {
    BLACK: 'bq.png',
    WHITE: 'wq.png',
  },
  KNIGHT: {
    BLACK: 'bn.png',
    WHITE: 'wn.png',
  },
  KING: {
    BLACK: 'bk.png',
    WHITE: 'wk.png',
  }
};

function getPiece(piece, isBlack) {
  const path = isBlack ? PATH[piece].BLACK : PATH[piece].WHITE;
  const node = document.createElement('img');
  node.src = BASE_PATH + path;
  node.style.height = "3rem"
  return node;
}

function createGrid(size) {
  chessBoard.innerHTML = '';
  grid = [];
  for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
          const node = document.createElement('div');
          node.className = 'node';
          node.setAttribute('data-row', i);
          node.setAttribute('data-col', j);
          chessBoard.appendChild(node);
          row.push(node);
      }
      grid.push(row);
  }
}

function setPieces() {
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => {
    const row = parseInt(node.getAttribute('data-row'));
    const col = parseInt(node.getAttribute('data-col'));
    
    if (row === 1 || row === 6) {
      node.appendChild(getPiece('PAWN',row === 1));
    }
    if (row === 0 || row === 7) {
      if (col === 0 || col === 7) {
        node.appendChild(getPiece('ROOK', row === 0));
      } else if (col === 1 || col === 6) {
        node.appendChild(getPiece('KNIGHT', row === 0));
      } else if (col === 2 || col === 5) {
        node.appendChild(getPiece('BISHOP', row === 0));
      } else if (col === 3) {
        node.appendChild(getPiece('QUEEN', row === 0));
      } else if (col === 4) {
        node.appendChild(getPiece('KING', row === 0));
      }
    }
  });
}

function initialize() {
  createGrid(BOARD_SIZE);
  setPieces();
}

initialize();