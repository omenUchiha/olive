import { myClient } from "../../..";
import { log, mergeInputFiles } from "../../../sdkFunctions";
import { chatroomContextType } from "../../contexts/chatroomContext";
import { InputFieldContextType } from "../../contexts/inputFieldContext";
type ConversationCreateData = {
  chatroom_id: any;
  created_at: any;
  has_files: boolean;
  text: any;
  attachment_count?: any;
  replied_conversation_id?: string | number;
};

type UploadConfigType = {
  conversation_id: number;
  files_count: number;
  index: number | string;
  meta?: any;
  name: string;
  thumbnail_url?: string;
  type: string;
  url: string;
};
const sendMessage = async (
  chatroomContext: chatroomContextType,
  chatroom_id: number,
  inputFieldContext: InputFieldContextType,
  setBufferMessage: any,
  setEnableInputBox: any
) => {
  try {
    setEnableInputBox(true);
    const {
      conversationList,
      setConversationList,
      selectedConversation,
      setSelectedConversation,
      isSelectedConversation,
      setIsSelectedConversation,
    } = chatroomContext;
    const {
      messageText,
      setMessageText,
      audioAttachments,
      setAudioAttachments,
      mediaAttachments,
      setMediaAttachments,
      documentAttachments,
      setDocumentAttachments,
    } = inputFieldContext;
    let message = messageText;
    let mediaContext = {
      mediaAttachments: [...mediaAttachments],
      audioAttachments: [...audioAttachments],
      documentAttachments: [...documentAttachments],
    };
    let filesArray = mergeInputFiles(mediaContext);
    // clean the chatrom context
    setMessageText("");
    setAudioAttachments([]);
    setMediaAttachments([]);
    setDocumentAttachments([]);
    // ||||||||||||||||||||||
    if (messageText.trim() === "" && filesArray.length === 0) {
      return;
    }
    let config: ConversationCreateData = {
      text: message,
      created_at: Date.now(),
      chatroom_id: chatroom_id,
      has_files: false,
    };
    if (filesArray.length) {
      config.has_files = true;
      config.attachment_count = filesArray.length;
    }
    if (isSelectedConversation) {
      config.replied_conversation_id = selectedConversation?.id;
      setSelectedConversation({});
      setIsSelectedConversation(false);
    }

    let createConversationCall = await myClient.onConversationsCreate(config);
    document.dispatchEvent(
      new CustomEvent("sentMessage", {
        detail: chatroom_id,
      })
    );
    setBufferMessage(createConversationCall.conversation);
    // render local changes here

    // above this point

    if (filesArray.length) {
      let index = 0;
      for (let newFile of filesArray) {
        let uploadConfig = {
          messageId: parseInt(createConversationCall.id),
          chatroomId: chatroom_id,
          file: newFile,
        };
        let fileType = "";
        if (filesArray[0].type.split("/")[1] === "pdf") {
          fileType = "pdf";
        } else if (filesArray[0].type.split("/")[0] === "audio") {
          fileType = "audio";
        } else if (filesArray[0].type.split("/")[0] === "video") {
          fileType = "video";
        } else {
          fileType = "image";
        }
        index++;
        myClient.uploadMedia(uploadConfig).then((fileResponse: any) => {
          let onUploadConfig = {
            conversation_id: parseInt(createConversationCall.id),
            files_count: 1,
            index: index,
            meta: {
              size: newFile.size,
            },
            name: newFile.name,
            type: fileType,
            url: fileResponse.Location,
          };
          myClient.onUploadFile(onUploadConfig);
        });
      }
    }
  } catch (error) {
    log(error);
  }
};

function deliverMessage() {}
export { sendMessage };
