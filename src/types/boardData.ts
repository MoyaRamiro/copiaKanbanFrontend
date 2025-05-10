import { BoardItem } from "./boardItem";

export interface BoardData {
  id: string;
  title: string;
  elements: BoardItem[];
}
