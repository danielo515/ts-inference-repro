import { useChat } from "@ai-sdk/react";
import type { ChatFilterCommand } from "@ts-inference/common";
import { DataParts } from "@ts-inference/common";
import { ChatMessage } from "./components/molecules/chat/types";

const noop = () => {};

export function DemoChat() {
  const { messages, sendMessage, addToolResult, status } = useChat<ChatMessage>(
    {
      dataPartSchemas: DataParts,
      onData: noop,
      onToolCall: ({ toolCall }) => {
        if (toolCall.dynamic) {
          return;
        }

        const planningToolCall = toolCall;

        let command: ChatFilterCommand | null = null;

        switch (planningToolCall.toolName) {
          case "applyViewFilters":
            command = {
              type: "applyViewFilters" as const,
              input: planningToolCall.input,
            };
            break;
          case "clearViewFilters":
            command = {
              type: "clearViewFilters" as const,
              input: planningToolCall.input,
            };
            break;
          case "setSearchContext":
            command = {
              type: "setSearchContext" as const,
              input: planningToolCall.input,
            };
            break;
          case "clearSearchContext":
            command = {
              type: "clearSearchContext" as const,
              input: planningToolCall.input,
            };
            break;
          default:
            break;
        }

        if (command) {
          window.dispatchEvent(
            new CustomEvent<ChatFilterCommand>("chatFilterCommand", {
              detail: command,
            })
          );

          // Add tool result to chat history
          addToolResult({
            tool: planningToolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output: {
              success: true,
              message: `${planningToolCall.toolName} executed successfully`,
            },
          }).then(() => {
            console.log(
              `${planningToolCall.toolName} - ${toolCall.toolCallId} tool call result added to chat history`
            );
          });
        }
      },
    }
  );

  // For demonstration purposes, log the current messages to show they're updating
  console.log("Current messages:", messages);
  console.log("Chat status:", status);

  return null;
}
