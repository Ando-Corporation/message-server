import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface Member {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  member: Member;
}

const members: Member[] = [
  { id: "mem_1", name: "Sarah Chen" },
  { id: "mem_2", name: "Jake Rivera" },
  { id: "mem_3", name: "Priya Patel" },
  { id: "mem_4", name: "Marcus Johnson" },
  { id: "mem_5", name: "Emily Tanaka" },
];

function getMessageContent(i: number): string {
  const contents = [
    "Hey, has anyone looked at the new designs?",
    "Yeah, I reviewed them this morning. Looks solid.",
    "I have a few concerns about the navigation flow.",
    "Can we set up a quick call to discuss?",
    "Sure, how about 2pm?",
    "Works for me. I'll send a calendar invite.",
    "Just pushed the fix for the login bug.",
    "Nice, I'll pull and test it now.",
    "The CI pipeline is green again.",
    "Great work everyone, let's keep this momentum.",
  ];
  return contents[i % contents.length];
}

const messages: Message[] = Array.from({ length: 110 }, (_, i) => ({
  id: `msg_${i + 1}`,
  content: `Message ${i + 1}: ${getMessageContent(i)}`,
  createdAt: new Date(2025, 0, 15, 10, i).toISOString(),
  member: members[i % members.length],
}));

const PAGE_SIZE = 50;

app.get("/api/conversations/:id/messages", (req: Request, res: Response) => {
  const cursor = req.query.cursor as string | undefined;
  const limit = parseInt(req.query.limit as string) || PAGE_SIZE;

  let startIndex = 0;
  if (cursor) {
    const cursorIndex = messages.findIndex((m) => m.id === cursor);
    if (cursorIndex === -1) {
      res.status(400).json({ error: "Invalid cursor" });
      return;
    }
    startIndex = cursorIndex + 1;
  }

  const pageMessages = messages.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < messages.length;
  const nextCursor = hasMore ? pageMessages[pageMessages.length - 1].id : null;

  res.json({
    messages: pageMessages,
    nextCursor,
    hasMore,
  });
});

app.post("/api/messages/:id/reactions", (req: Request, res: Response) => {
  const { emoji } = req.body;
  const messageId = req.params.id;

  if (!emoji) {
    res.status(400).json({ error: "emoji is required" });
    return;
  }

  res.json({ messageId, emoji, success: true });
});

app.listen(PORT, () => {
  console.log(`Interview server running on http://localhost:${PORT}`);
});
