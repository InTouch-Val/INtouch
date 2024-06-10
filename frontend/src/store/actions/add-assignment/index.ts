// Предполагаем, что типы уже определены в types.ts
import {
  AddBlockAction,
  RemoveBlockAction,
  UpdateBlockAction,
} from "../../entities/add-assignment/types";

// Создание действия addBlock
export const addBlock = (
  type: AddBlockAction["payload"]["type"]
): AddBlockAction => ({
  type: "ADD_BLOCK",
  payload: { type },
});

// Создание действия removeBlock
export const removeBlock = (
  blockId: RemoveBlockAction["payload"]["blockId"]
): RemoveBlockAction => ({
  type: "REMOVE_BLOCK",
  payload: { blockId },
});

export const updateBlock = (
  blockId: number,
  updates: Partial<Omit<UpdateBlockAction["payload"], "blockId">>
): UpdateBlockAction => ({
  type: "UPDATE_BLOCK",
  payload: {
    blockId,
    ...updates,
  },
});
