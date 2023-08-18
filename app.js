const chessBoard = document.getElementById('board');
const alert = document.getElementById('alert');

const BOARD_SIZE = 8;
const BASE_PATH = './public/';

let holding = null;

let toggle = true;

let errImg = `<img src="${BASE_PATH + 'err.jpeg'}" >`

const isFirstMove = {};
let uniqueId = 1;

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

function getPiece(piece, isBlack, row, col) {
  const path = isBlack ? PATH[piece].BLACK : PATH[piece].WHITE;
  const node = document.createElement('img');
  node.src = BASE_PATH + path;
  node.style.height = "3rem"
  node.style.width = "3rem"
  isBlack ? node.setAttribute('color', 'black') : node.setAttribute('color', 'white');
  node.setAttribute('draggable', true);
  node.setAttribute('piece', true);
  node.setAttribute('kind', piece);
  node.setAttribute('row', row);
  node.setAttribute('col', col);
  node.setAttribute('id', uniqueId);
  isFirstMove[uniqueId] = true;
  uniqueId += 1;

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
          node.setAttribute('piece', false);
          node.addEventListener('dragstart', drag);
          node.addEventListener('click', grabOrDrop);
          chessBoard.appendChild(node);
          row.push(node);
      }
      grid.push(row);
  }
}

function throwError(HTMLElement, kind, text) {
  if (kind === "danger") {
    HTMLElement.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
  }
}

function willGetCheck() {
  return false;
}

function handleClash(mover, reciever) {
  const mColor = mover.getAttribute('color');
  const rColor = reciever.getAttribute('color');

  if (mColor === rColor) {
    throwError(alert, "danger", "<strong>Not allowed.</strong> Cannibalism!!!");
    return;
  }

  if (willGetCheck()) {
    throwError(alert, "danger", "<strong>King not safe!</strong>");
    return;
  }

  const nodes = document.querySelectorAll('.node');

  const rr = parseInt(reciever.getAttribute('row'));
  const rc = parseInt(reciever.getAttribute('col'));

  const mr = parseInt(mover.getAttribute('row'));
  const mc = parseInt(mover.getAttribute('col'));

  let mov = null, rec = null;

  nodes.forEach(n => {
    const nr = parseInt(n.getAttribute('data-row'));
    const nc = parseInt(n.getAttribute('data-col'));
    if (nr === rr && nc === rc) {
      rec = n;
    }

    if (nr === mr && nc === mc) {
      mov = n;
    }
  });

  if (mov && rec) {
    mover.setAttribute('row', rr);
    mover.setAttribute('col', rc);
    rec.innerHTML = mov.innerHTML;
    mov.innerHTML = "";
  }
}

function validMove(start, end, clashing) {
  if (!clashing) {
    const srow = parseInt(start.getAttribute('row'));
    const scol = parseInt(start.getAttribute('col'));
    const erow = parseInt(end.getAttribute('data-row'));
    const ecol = parseInt(end.getAttribute('data-col'));
    
    switch (start.getAttribute('kind')) {
      case 'PAWN': {
        if (isFirstMove[start.getAttribute('id')]) {
          if ((srow !== erow + 1 && srow !== erow + 2) || (scol !== ecol)) {
            throwError(alert, "danger", errImg);
            return false;
          } else { 
            isFirstMove[start.getAttribute('id')] = false;
            return true;
          }
        } else {
          if ((srow !== erow + 1) || (scol !== ecol)) {
            throwError(alert, "danger", errImg);
            return false;
          } else {
            return true;
          }
        }
      }

      case 'KNIGHT': {
        const rowDiff = Math.abs(srow - erow);
        const colDiff = Math.abs(scol - ecol);
        
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          return true;
        } else {
          throwError(alert, "danger", errImg);
          return false;
        }
      }
      
    }
  } else {
    handleClash(start, end);
  }
}

function grabOrDrop(event) {
  const node = event.target;

  if (holding && node.getAttribute('piece') === 'false') {
    if (!validMove(holding, node, false)) {
      holding = null;
      return;
    }

    const row = parseInt(node.getAttribute('data-row'));
    const col = parseInt(node.getAttribute('data-col'));

    const nodes = document.querySelectorAll('.node');
    nodes.forEach(n => {
      const nr = parseInt(n.getAttribute('data-row'));
      const nc = parseInt(n.getAttribute('data-col'));
      if (nr === row && nc === col) {
        holding.setAttribute('row', nr);
        holding.setAttribute('col', nc);
        n.appendChild(holding)
        holding = null;
      }
    });
    return;
  }

  if (holding && node.getAttribute('piece') && holding !== node) {
    if (!validMove(holding, node, true)) {
      holding = null;
      return;
    }
    holding = null;
    return;
  }

  if (node.getAttribute('piece') === 'true') {
    holding = node;
    return;
  }
}

function drag(event) {
  // console.log(event.target)
}

function setPieces() {
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => {
    const row = parseInt(node.getAttribute('data-row'));
    const col = parseInt(node.getAttribute('data-col'));
    
    if (row === 1 || row === 6) {
      node.appendChild(getPiece('PAWN',row === 1, row, col));
    }
    if (row === 0 || row === 7) {
      if (col === 0 || col === 7) {
        node.appendChild(getPiece('ROOK', row === 0, row, col));
      } else if (col === 1 || col === 6) {
        node.appendChild(getPiece('KNIGHT', row === 0, row, col));
      } else if (col === 2 || col === 5) {
        node.appendChild(getPiece('BISHOP', row === 0, row, col));
      } else if (col === 3) {
        node.appendChild(getPiece('QUEEN', row === 0, row, col));
      } else if (col === 4) {
        node.appendChild(getPiece('KING', row === 0, row, col));
      }
    }
  });
}

function handleNodeClick(event) {
  const node = event.target;
  // console.log(node)
}

function initialize() {
  createGrid(BOARD_SIZE);
  setPieces();

  // chessBoard.removeEventListener('click', handleNodeClick);
  chessBoard.addEventListener('click', handleNodeClick);
}

initialize();