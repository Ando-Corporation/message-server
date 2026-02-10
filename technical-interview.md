# Frontend Technical Interview

## What to expect

This is a single coding exercise with escalating phases. You'll start with something straightforward and we'll layer on complexity. How far you get matters less than how you think through each step.

You can use any libraries, tools, or references you'd normally use. We're not testing memorization.

---

## The Exercise

You'll be given a REST API endpoint that returns paginated messages for a conversation. Your job is to build a state management layer to fetch and store this data, then render the messages.

### The endpoint

`GET /api/conversations/:id/messages?cursor=...&limit=20`

### Response shape

```json
{
  "messages": [
    {
      "id": "msg_1",
      "content": "Hey, has anyone looked at the new designs?",
      "createdAt": "2025-01-15T10:30:00Z",
      "member": { "id": "mem_1", "name": "Sarah Chen" }
    }
  ],
  "nextCursor": "cursor_abc123",
  "hasMore": true
}
```

---

## Phases

### Phase 1: Architecture

Choose how you want to manage state and data fetching. There's no right answer — we want to hear your reasoning.

### Phase 2: Implementation

Build the data layer and render the messages in a list. Handle pagination.

### Phase 3: Real-time

A WebSocket now pushes new messages into the conversation. You'll receive an event shape and integrate it into your existing architecture.

```json
{
  "type": "new_message",
  "conversationId": "conv_1",
  "message": {
    "id": "msg_99",
    "content": "Just pushed the fix",
    "createdAt": "2025-01-15T11:02:00Z",
    "member": { "id": "mem_2", "name": "Jake Rivera" }
  }
}
```

### Phase 4: Optimistic mutations

Users can react to messages with emoji. Reactions should appear instantly without waiting for the server. If the server call fails, roll it back. Other users see reactions arrive via WebSocket.

- Mutation endpoint: `POST /api/messages/:id/reactions` with body `{ emoji: "thumbsup" }`
- WebSocket event: `{ "type": "reaction_added", "messageId": "msg_1", "emoji": "thumbsup", "memberId": "mem_1" }`

---

## What we're looking for

- Clear reasoning about your choices. Tell us what you're doing and why.
- Working code that handles real-world concerns (loading states, errors, edge cases).
- An architecture that adapts as requirements change — you'll see this happen in real-time.
- Honest trade-off awareness. Naming what you're *not* doing and why is a strength.
