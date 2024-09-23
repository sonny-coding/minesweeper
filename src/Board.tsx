import { useState, useEffect } from "react";
import { CellValue, Cell } from "./Cell";

type BoardProps = {
  rows: number;
  cols: number;
  mines: number;
};

const Board = ({ rows, cols, mines }: BoardProps) => {
  const [board, setBoard] = useState<CellValue[][]>([]);
  const [revealed, setRevealed] = useState<boolean[][]>([]);
  const [flagged, setFlagged] = useState<boolean[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newBoard = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0));
    const newRevealed = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));
    const newFlagged = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    setBoard(newBoard);
    setRevealed(newRevealed);
    setFlagged(newFlagged);
    setGameOver(false);
    setWin(false);
    setIsFirstClick(true);
  };

  const placeMines = (firstClickRow: number, firstClickCol: number) => {
    const newBoard = [...board];
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);

      // Ensure we don't place a mine on the first clicked cell or its neighbors
      if (
        newBoard[row][col] !== "mine" &&
        (Math.abs(row - firstClickRow) > 1 || Math.abs(col - firstClickCol) > 1)
      ) {
        newBoard[row][col] = "mine";
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c] !== "mine") {
          newBoard[r][c] = countAdjacentMines(newBoard, r, c);
        }
      }
    }

    setBoard(newBoard);
  };

  const countAdjacentMines = (
    board: CellValue[][],
    row: number,
    col: number
  ): number => {
    let count = 0;
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (
        let c = Math.max(0, col - 1);
        c <= Math.min(cols - 1, col + 1);
        c++
      ) {
        if (board[r][c] === "mine") count++;
      }
    }
    return count;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || win || flagged[row][col]) return;

    if (isFirstClick) {
      placeMines(row, col);
      setIsFirstClick(false);
    }

    const newRevealed = revealed.map((r) => [...r]);
    revealCell(newRevealed, row, col);

    if (board[row][col] === "mine") {
      setGameOver(true);
    } else {
      setRevealed(newRevealed);
      checkWin(newRevealed);
    }
  };

  const revealCell = (newRevealed: boolean[][], row: number, col: number) => {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      newRevealed[row][col]
    )
      return;

    newRevealed[row][col] = true;

    if (board[row][col] === 0) {
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          revealCell(newRevealed, r, c);
        }
      }
    }
  };

  const handleCellRightClick = (
    e: React.MouseEvent,
    row: number,
    col: number
  ) => {
    e.preventDefault();
    if (gameOver || win || revealed[row][col]) return;

    const newFlagged = flagged.map((r) => [...r]);
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
  };

  const checkWin = (newRevealed: boolean[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] !== "mine" && !newRevealed[r][c]) return;
      }
    }
    setWin(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        {gameOver ? "Game Over!" : win ? "You Win!" : "Minesweeper"}
      </div>
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              value={cell}
              isRevealed={revealed[r][c]}
              isFlagged={flagged[r][c]}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={(e) => handleCellRightClick(e, r, c)}
            />
          ))
        )}
      </div>
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        New Game
      </button>
    </div>
  );
};

export default Board;
