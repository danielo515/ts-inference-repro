import { useChat } from "@ai-sdk/react";
import type {
  InferUIDataParts,
  InferUITool,
  UIMessage,
  UIMessagePart,
} from "ai";
import { useMemo } from "react";
import type {
  ChatFilterCommand,
  FilterTag,
  PlanningToolInvocation,
  PlanningToolSet,
} from "@ts-inference/common";
import { DataParts } from "@ts-inference/common";

type ChatTextPart = {
  readonly type: "text";
  readonly text: string;
};

type ChatMessage = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly parts: ReadonlyArray<ChatTextPart>;
  readonly metadata?: {
    readonly createdAt?: number;
    readonly filters?: ReadonlyArray<FilterTag>;
  };
};

const initialMessages: ChatMessage[] = [
  {
    id: "user-initial",
    role: "user",
    parts: [
      {
        type: "text",
        text: "Bitte filtere die Ansicht auf Kostenstellen.",
      },
    ],
  },
  {
    id: "assistant-initial",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Ich kümmere mich um die Filter.",
      },
    ],
  },
];

const noop = () => {};

export function DemoChat() {
  const {
    messages,
    sendMessage,
    addToolResult,
    status,
  } = useChat<ChatMessage>({
    initialMessages,
    dataPartSchemas: DataParts,
    onData: noop,
    onToolCall: ({ toolCall }) => {
      if (toolCall.dynamic) {
        return;
      }

      const planningToolCall = toolCall as PlanningToolInvocation;

      switch (planningToolCall.toolName) {
        case "applyViewFilters":
        case "clearViewFilters":
        case "setSearchContext":
        case "clearSearchContext": {
          const command = {
            type: planningToolCall.toolName,
            input: planningToolCall.input,
          } satisfies ChatFilterCommand;

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
          break;
        }
        default:
          break;
      }
    },
  });

  // For demonstration purposes, log the current messages to show they're updating
  console.log("Current messages:", messages);
  console.log("Chat status:", status);

  return null;
}
