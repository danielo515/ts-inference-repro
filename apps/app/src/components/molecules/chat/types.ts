import type { DataParts, PlanningToolSet } from "@ts-inference/common";
import type {
  InferUIDataParts,
  InferUITool,
  UIMessage,
  UIMessagePart,
} from "ai";

type Metadata = {
  createdAt: number;
};

export type ChatMessage = UIMessage<
  Metadata,
  InferUIDataParts<DataParts>,
  UiChatTools
>;

export type UiChat = {
  id: string;
  title: string;
  createdAt: Date;
  planningId: string | null;
  userId?: string;
  lastMessage: ChatMessage | null;
};

// Tool type definitions using InferUITool
export type ApplyViewFiltersTool = InferUITool<PlanningToolSet["applyViewFilters"]>;
export type ClearViewFiltersTool = InferUITool<PlanningToolSet["clearViewFilters"]>;
export type SetSearchContextTool = InferUITool<PlanningToolSet["setSearchContext"]>;
export type ClearSearchContextTool = InferUITool<PlanningToolSet["clearSearchContext"]>;

// Make this explicit since inferring too many types can overwhelm the type checker
export type UiChatTools = {
  applyViewFilters: ApplyViewFiltersTool;
  clearViewFilters: ClearViewFiltersTool;
  setSearchContext: SetSearchContextTool;
  clearSearchContext: ClearSearchContextTool;
};

export type MessagePart = UIMessagePart<DataParts, UiChatTools>;

// Document-modifying tool names for auto-draft detection
export const DOCUMENT_MODIFYING_TOOLS = [
  "applyViewFilters",
  "setSearchContext",
] as const;

export type DocumentModifyingTool = (typeof DOCUMENT_MODIFYING_TOOLS)[number];

export const isDocumentModifyingTool = (
  toolName: string
): toolName is DocumentModifyingTool => {
  return DOCUMENT_MODIFYING_TOOLS.includes(toolName as DocumentModifyingTool);
};