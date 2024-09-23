export type CellValue = number | "mine";

type CellProps = {
  value: CellValue;
  isRevealed: boolean;
  isFlagged: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

export const Cell = ({
  value,
  isFlagged,
  isRevealed,
  onClick,
  onContextMenu,
}: CellProps) => {
  let content = "";
  if (isRevealed) {
    content = value === "mine" ? "💣" : value > 0 ? value.toString() : "";
  } else if (isFlagged) {
    content = "🚩";
  }
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`w-8 h-8 border border-gray-400 ${
        isRevealed ? "bg-gray-200" : "bg-gray-300"
      }`}
    >
      {content}
    </button>
  );
};

export default Cell;
