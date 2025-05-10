import { BoardData } from "@/types/boardData";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const BoardForm = ({
  boards,
  setBoards,
  updateSocketBoard,
}: {
  boards: BoardData[];
  setBoards: (boards: BoardData[]) => void;
  updateSocketBoard: (boards: BoardData[]) => void;
}) => {
  const [title, setTitle] = useState("");

  const handleAddBoard = () => {
    if (title.trim() === "") return;

    const newBoard: BoardData = {
      id: uuidv4(),
      title,
      elements: [],
    };

    setBoards([...boards, newBoard]);
    updateSocketBoard([...boards, newBoard]);
    setTitle("");
  };
  return (
    <div>
      <label className="h-fit w-fit" htmlFor="add-board">
        <div className="flex my-10 mx-1 px-5 py-2.5 h-fit w-96 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer">
          <input type="checkbox" id="add-board" className="hidden peer" />

          {/* Before add board */}
          <div className="flex w-full peer-checked:hidden">
            <svg className="w-6 h-6 mx-3 items-center">
              <use href="icons.svg#add" />
            </svg>
            Añade otra lista...
          </div>

          {/* Add board */}
          <form className="w-full hidden peer-checked:flex">
            <input
              className="border-gray-700 border-2 w-full bg-transparent text-gray-300 focus:outline-none resize-y overflow-hidden px-5 pt-1 rounded-lg"
              placeholder="Escribe el título de la tarjeta..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex justify-end">
              <label
                className="m-3 rounded-lg  text-gray-300 cursor-pointer bg-gray-900 w-fit p-2 hover:bg-gray-800"
                onClick={() => {
                  handleAddBoard();
                }}
                /*falta el submit */
              >
                <span>Añadir</span>
              </label>
            </div>
          </form>
        </div>
      </label>
    </div>
  );
};

export default BoardForm;
