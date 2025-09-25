import type { ChatMessage, UiChatTools } from "./types";

// This file demonstrates the TypeScript inference issue with ChatMessage

// Example ChatMessage object that should have proper type inference
export const exampleChatMessage: ChatMessage = {
  id: "msg-1",
  role: "assistant",
  content: [
    {
      type: "text",
      text: "I'll help you apply some filters to your view.",
    },
    {
      type: "tool-call",
      toolCallId: "call-1",
      toolName: "applyViewFilters",
      args: {
        filters: [
          {
            field: "costCenter",
            value: "CC001",
            label: "Cost Center 001",
          },
        ],
        replace: false,
      },
    },
  ],
  createdAt: Date.now(),
};

// Function that should properly infer the tool types from ChatMessage
export function processToolCall(message: ChatMessage) {
  const toolCalls = message.content.filter(
    (part): part is Extract<typeof part, { type: "tool-call" }> =>
      part.type === "tool-call"
  );

  for (const toolCall of toolCalls) {
    // This should have proper type inference for toolName and args
    // The issue is likely that TypeScript struggles to infer the correct
    // union types when there are complex nested generics
    
    switch (toolCall.toolName) {
      case "applyViewFilters":
        // toolCall.args should be inferred as ToolApplyViewFiltersParams
        console.log("Applying filters:", toolCall.args.filters);
        break;
      case "clearViewFilters":
        // toolCall.args should be inferred as ToolClearViewFiltersParams
        console.log("Clearing filters:", toolCall.args.filterFields);
        break;
      case "setSearchContext":
        // toolCall.args should be inferred as ToolSetSearchContextParams
        console.log("Setting search context:", toolCall.args.context);
        break;
      case "clearSearchContext":
        // toolCall.args should be inferred as ToolClearSearchContextParams
        console.log("Clearing search context");
        break;
      default:
        // This should show a TypeScript error if all cases are handled
        const _exhaustive: never = toolCall;
        break;
    }
  }
}

// Type test to check if inference works correctly
type TestToolCallType = ChatMessage["content"][number];
type TestToolCall = Extract<TestToolCallType, { type: "tool-call" }>;

// This should properly infer the tool names
type TestToolNames = TestToolCall["toolName"];

// This should properly infer the args for each tool
type TestApplyFiltersArgs = Extract<
  TestToolCall,
  { toolName: "applyViewFilters" }
>["args"];

// Export types for inspection
export type {
  TestToolCallType,
  TestToolCall,
  TestToolNames,
  TestApplyFiltersArgs,
};