// hooks/useChatMessages.ts
export type DisplayMessage = { from: "user" | "support"; text: string; created_at?: string };

export function mapMessages(msgs: any, currentUserId: number): DisplayMessage[] {
  const arr = Array.isArray(msgs) ? msgs : msgs?.data;
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map((msg) => ({
    from: msg.sender_id === currentUserId ? "user" : "support",
    text: String(msg.content),
    created_at: msg.created_at,
  }));
}
