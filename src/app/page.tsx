"use client";
import { BoardData } from "@/types/boardData";
import { useEffect, useRef, useState } from "react";
import Board from "./board";
import BoardForm from "./boardForm";
import { io, Socket } from "socket.io-client";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { state } from "@formkit/drag-and-drop";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [wallTitle, setWallTitle] = useState("Mi Pared de Tableros");

  const [boardList, boardData, setBoardData] = useDragAndDrop<
    HTMLUListElement,
    BoardData
  >([], {
    group: "boardList",
    dragHandle: ".kanban-handle",
    selectedClass: "rounded-lg",
    onDragend: () => {
      updateSocketBoard(boardData);
    },
  });

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Conectado al servidor");
      });

      socketRef.current.on("initialBoardData", (data: BoardData[]) => {
        console.log("📨 Datos iniciales recibidos:", data);
        setBoardData(data);
      });

      socketRef.current.on("update", (data: BoardData[]) => {
        console.log("📨 Actualización recibida:", data);
        setBoardData(data);
      });
    }

    return () => {
      if (socketRef.current) {
        console.log("🔌 Desconectando socket...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const removeBoard = (id: string) => {
    const newBoards = boardData.filter((board) => board.id !== id);
    setBoardData(newBoards);
    updateSocketBoard(newBoards);
  };

  const updateSocketBoard = (data: BoardData[]) => {
    socketRef.current?.emit("boardUpdate", { boardData: data });
    console.log("🔄 Emitiendo actualización de servidor:", data);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="w-full p-6 bg-black shadow-lg z-10">
        <input
          className="text-4xl font-bold bg-transparent text-white outline-none border-b-2 border-transparent focus:border-blue-500 transition-all duration-300 w-full max-w-xl mx-auto pl-6"
          value={wallTitle}
          onChange={(e) => setWallTitle(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max h-full">
          <ul ref={boardList} className="flex flex-row list-none">
            {boardData.map((board) => (
              <li key={board.id} className="flex-shrink-0" data-label={board}>
                <div className="kanban-handle">
                  <Board
                    id={board.id}
                    title={board.title}
                    elements={board.elements}
                    removeBoard={removeBoard}
                    updateSocketBoard={updateSocketBoard}
                    boardData={boardData}
                    setBoardData={setBoardData}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex-shrink-0">
            <BoardForm
              updateSocketBoard={updateSocketBoard}
              setBoards={setBoardData}
              boards={boardData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
