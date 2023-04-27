import { useEffect } from "react";
import MessageBlock from "../message-boxes-components/MessageBlock";

export default function BufferStack({ bufferMessage, updateHeight }: any) {
  useEffect(() => {
    updateHeight();
  });
  return (
    <>
      <div
        className="ml-[28px] mr-[114px] pt-5 z:max-md:mr-[28px] z:max-sm:ml-2  z:max-sm:mr-0"
        key={bufferMessage.id}
      >
        <MessageBlock
          userId={bufferMessage.member_id}
          conversationObject={bufferMessage}
        />
      </div>
    </>
  );
}
