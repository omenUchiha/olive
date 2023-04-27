import { createContext } from "react";

export type chatroomContextType = {
  conversationList: any;
  setConversationList: any;
  selectedConversation: any;
  setSelectedConversation: any;
  isSelectedConversation: any;
  setIsSelectedConversation: any;
};

const ChatroomContext = createContext<chatroomContextType>({
  conversationList: [],
  setConversationList: null,
  selectedConversation: {},
  setSelectedConversation: null,
  isSelectedConversation: false,
  setIsSelectedConversation: null,
});

export default ChatroomContext;
