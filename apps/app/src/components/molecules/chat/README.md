# TypeScript Inference Issue with ChatMessage

This directory contains a reproduction of a TypeScript inference issue with the `ChatMessage` type definition.

## Problem Description

The `ChatMessage` type is defined using complex generic types from the AI SDK:

```typescript
export type ChatMessage = UIMessage<
  Metadata,
  InferUIDataParts<DataParts>,
  UiChatTools
>;
```

This creates a complex type structure where:

1. `UIMessage` is a generic type from the AI SDK
2. `InferUIDataParts<DataParts>` infers data part types from a const object
3. `UiChatTools` is a mapped type of tool definitions

## The Issue

The TypeScript compiler struggles with type inference when:

1. **Deep Generic Nesting**: Multiple levels of generic type inference
2. **Union Type Complexity**: Tool calls create complex union types
3. **Conditional Type Resolution**: `InferUITool` and `InferUIDataParts` use conditional types

## Files

- `types.ts` - Contains the problematic type definitions
- `test-inference.ts` - Demonstrates where inference fails
- `README.md` - This explanation

## Expected Behavior

When processing tool calls in a `ChatMessage`, TypeScript should:

1. Properly infer `toolCall.toolName` as a union of specific tool names
2. Infer `toolCall.args` based on the specific tool name
3. Provide proper autocomplete and type checking

## Actual Behavior

TypeScript may:

1. Fall back to `any` or `unknown` types
2. Show overly complex error messages
3. Fail to provide proper autocomplete
4. Take excessive time to resolve types

## Reproduction Steps

1. Open `test-inference.ts` in your TypeScript-enabled editor
2. Check the type inference for `toolCall.toolName` and `toolCall.args`
3. Try to add autocomplete in the switch statement cases
4. Run `pnpm typecheck` to see any compilation issues

## Potential Solutions

1. **Explicit Type Annotations**: Add explicit types to break inference chains
2. **Type Helpers**: Create intermediate type helpers to simplify inference
3. **Const Assertions**: Use `as const` to improve literal type inference
4. **Interface Segregation**: Split complex types into smaller, focused interfaces