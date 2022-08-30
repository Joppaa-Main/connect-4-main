import { boardRows, boardCols } from "const";
import { useRecoilState } from "recoil";
import { boardState, gameOverState, playerState } from "state";


const testWin = (arr: number[]): boolean => /1{4}|2{4}/.test(arr.join(""));
const usePlayPiece = () => {
  const [board, setBoard] = useRecoilState(boardState);
  const [player, setPlayerTurn] = useRecoilState(playerState);
  const [gameOver, setGameOver] = useRecoilState(gameOverState);

  return (col: number) => {
    // Prevent adding a piece when the game is over
    if (gameOver) {
      return;
    }
    // Prevent adding a piece when the column is full
    if (board[col].length === boardRows) {
      return;
    }
    // Play piece (non mutating)
    const newBoard = board.map((column, i) =>
      i === col ? [...column, player] : column // type  of column is player 
    );
    const row = newBoard[col].length - 1;

    // Couldn't finish the task on time so, looked through the github forks and really like how this was implemeted. 
    const upperRightDiagonal = (position: number) => {
      if (col + position >= boardCols || row + position >= boardRows) {
        return 0
      } return newBoard[col + position][row + position] || 0
    };
    const lowerLeftDiagonal = (position: number) => {
      if (col - position < 0 || row - position < 0) {
        return 0
      } return newBoard[col - position][row - position] || 0
    };
    const topLeftDiagonal = (position: number) => {
      if (col - position < 0 || row + position >= boardRows) {
        return 0
      } return newBoard[col - position][row + position] || 0
    };
    const lowerRightDiagonal = (position: number) => {
      if (col + position >= boardCols || row - position < 0) {
        return 0
      } return newBoard[col + position][row - position] || 0
    };
    if (
      testWin(newBoard[col]) || // Did win vertically
      testWin(newBoard.map((col) => col[row] || 0)) || // Did win horizontally
      testWin([player, upperRightDiagonal(1), upperRightDiagonal(2), upperRightDiagonal(3)]) || 
      testWin([player, lowerLeftDiagonal(1), lowerLeftDiagonal(2), lowerLeftDiagonal(3)]) ||
      testWin([player, topLeftDiagonal(1), topLeftDiagonal(2), topLeftDiagonal(3)]) ||
      testWin([player, lowerRightDiagonal(1), lowerRightDiagonal(2), lowerRightDiagonal(3)])  
    ) {
      setGameOver(true);
    } else {
      setPlayerTurn(player === 1 ? 2 : 1);
    }
    setBoard(newBoard);
    console.log([player, upperRightDiagonal(1), upperRightDiagonal(2), upperRightDiagonal(3)]);
  };
};

export default usePlayPiece;
