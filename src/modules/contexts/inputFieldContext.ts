import { createContext } from "react";

export type InputFieldContextType = {
  messageText: any;
  setMessageText: any;
  audioAttachments: any;
  setAudioAttachments: any;
  mediaAttachments: any;
  setMediaAttachments: any;
  documentAttachments: any;
  setDocumentAttachments: any;
};

const InputFieldContext = createContext<InputFieldContextType>({
  messageText: "",
  setMessageText: null,
  audioAttachments: [],
  setAudioAttachments: null,
  mediaAttachments: [],
  setMediaAttachments: null,
  documentAttachments: [],
  setDocumentAttachments: null,
});

export default InputFieldContext;
