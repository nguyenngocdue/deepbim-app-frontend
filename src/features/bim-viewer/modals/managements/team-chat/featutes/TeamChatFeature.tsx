import { TeamChatBox } from "../components/TeamChatBox"; // Component bạn gửi ở trên
import { useTeamChatSocket } from "../hooks/useTeamChatSocket";

export function TeamChatFeature({
  teamId,
  currentUser,
  teamName,
  onShowInfo,
}: {
  teamId: number;
  currentUser: Object;
  teamName?: string;
  onShowInfo?: () => void;
}) {
  const { messages, sendTeamMessage, typingUsers, sendTyping, loadingMessage } = useTeamChatSocket(teamId, currentUser);

  return (
    <TeamChatBox
      teamId={teamId}
      messages={messages}
      onSend={sendTeamMessage}
      teamName={teamName}
      onShowInfo={onShowInfo}
      typingUsers={typingUsers}
      sendTyping={sendTyping}
      loadingMessage={loadingMessage}
    />
  );
}
