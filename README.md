# TypeScript Inference Reproduction Case

This repository reproduces TypeScript inference issues with AI SDK tool type narrowing in complex type relationships.

## Problem Description

This reproduction case demonstrates issues with TypeScript's ability to properly infer and narrow tool types when using the AI SDK's `useChat` hook with complex tool definitions and data part schemas.

## Structure

- `apps/app/` - Main application with the `DemoChat` component that uses `useChat`
- `packages/common/` - Shared types and schemas including `PlanningToolSet` and `DataParts`
- `packages/shared-types/` - Basic shared type definitions
- `packages/typescript-config/` - Shared TypeScript configuration

## Key Components

### Tool Type Definitions

The reproduction includes:
- `PlanningToolSet` - Defines tools using AI SDK's `Tool<Params, Result>` type
- `DataParts` - Schema definitions for tool parameters using Zod
- Complex tool invocation types with union types and conditional logic

### Chat Implementation

The `DemoChat` component in `apps/app/src/chat.ts` demonstrates:
- Usage of `useChat` with custom message types
- Tool call handling with type narrowing attempts
- Integration with `dataPartSchemas` for parameter validation

## Running the Reproduction

```bash
# Install dependencies
pnpm install

# Run type checking to see the inference issues
pnpm typecheck
```

## Expected Issues

When running `pnpm typecheck`, you should see TypeScript inference issues related to:
- Tool type narrowing in the `onToolCall` handler
- Complex type relationships between `PlanningToolSet`, `DataParts`, and message types
- Issues with `InferUITool` and `InferUIDataParts` type helpers

## Context

This reproduction is based on a real-world chat system that integrates with planning tools and uses the AI SDK for chat functionality. The complexity arises from the need to:
- Support multiple tool types with different parameter schemas
- Maintain type safety across tool invocations
- Handle both static and dynamic tool calls
- Integrate with existing type systems and schemas