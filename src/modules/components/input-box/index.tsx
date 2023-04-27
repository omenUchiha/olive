import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SendIcon from "./../../../assets/svg/send.svg";
import styled from "@emotion/styled";
import smiley from "./../../../assets/svg/smile.svg";
import camera from "./../../../assets/svg/camera.svg";
import mic from "./../../../assets/svg/mic.svg";
import paperclip from "./../../../assets/svg/paperclip.svg";
import pdfIcon from "../../../assets/svg/pdf-document.svg";
import { UserContext } from "../../contexts/userContext";
import EmojiPicker from "emoji-picker-react";
import { MentionsInput, Mention } from "react-mentions";
import { Close, Title } from "@mui/icons-material";
import "./Input.css";
import ChatroomContext from "../../contexts/chatroomContext";
import { clearInputFiles, getString, log } from "../../../sdkFunctions";
import { sendMessage } from "./input";
import { useParams } from "react-router-dom";
import ReplyBox from "./replyContainer";
import { myClient } from "../../..";
import InputFieldContext from "../../contexts/inputFieldContext";
import { INPUT_BOX_DEBOUNCE_TIME } from "../../constants/constants";
const StyledInputWriteComment = styled(TextField)({
  background: "#F9F9F9",
  borderRadius: "20px",
  ".MuiInputBase-input.MuiFilledInput-input": {
    padding: "16px",
    borderBottom: "none",
    borderRadius: "20px",
  },
});

function Input({ updateHeight, setBufferMessage }: any) {
  const [messageText, setMessageText] = useState("");
  const [audioAttachments, setAudioAttachments] = useState([]);
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [documentAttachments, setDocumentAttachments] = useState([]);
  return (
    <InputFieldContext.Provider
      value={{
        messageText,
        setMessageText,
        audioAttachments,
        setAudioAttachments,
        mediaAttachments,
        setMediaAttachments,
        documentAttachments,
        setDocumentAttachments,
      }}
    >
      <Box className="pt-[20px] pb-[5px] px-[40px] bg-white z:max-md:pl-2 ">
        <InputSearchField setBufferMessage={setBufferMessage} />
        <InputOptions />
      </Box>
    </InputFieldContext.Provider>
  );
}

function InputSearchField({ setBufferMessage }: any) {
  const [memberDetailsArray, setMemberDetailsArray] = useState<Array<any>>([]);
  const [enableInputBox, setEnableInputBox] = useState(false);
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const { messageText, setMessageText } = inputFieldContext;
  const inputBoxRef = useRef<any>(null);
  const { id = "" } = useParams();
  useEffect(() => {
    if (enableInputBox) {
      setTimeout(() => {
        setEnableInputBox(false);
      }, INPUT_BOX_DEBOUNCE_TIME);
    }
  });
  useEffect(() => {
    async function getAllMembers() {
      let cont = true;
      let list: any = [];
      let pgNo = 1;
      while (cont) {
        let call = await myClient.allMembers({
          chatroom_id: parseInt(id),
          community_id: parseInt(sessionStorage.getItem("communityId")!),
          page: pgNo,
        });
        list = list.concat(call.members);
        pgNo = pgNo + 1;
        if (call.members.length < 10) {
          cont = false;
        }
      }
      list = list.map((member: any) => {
        return {
          id: member.id,
          display: member.name,
          community: sessionStorage.getItem("communityId"),
          imageUrl: member.image_url,
        };
      });
      setMemberDetailsArray(list);
    }

    getAllMembers();
  }, [id]);
  useEffect(() => {
    if (!!inputBoxRef.current) {
      inputBoxRef?.current?.focus();
    }
  });

  let keyObj = {
    enter: false,
    shift: false,
  };

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      {/* for adding reply */}
      {chatroomContext.isSelectedConversation ? (
        <ReplyBox
          openReplyBox={chatroomContext.isSelectedConversation}
          memberName={chatroomContext.selectedConversation?.member?.name}
          answer={chatroomContext.selectedConversation?.answer}
          setIsSelectedConversation={chatroomContext.setIsSelectedConversation}
          setSelectedConversation={chatroomContext.setSelectedConversation}
          attachments={chatroomContext.selectedConversation.attachments}
        />
      ) : null}

      {/* for preview Image */}
      <DocPreview />
      <AudioPreview />
      <ImagePreview />
      <div className="relative">
        <IconButton
          onClick={() => {
            sendMessage(
              chatroomContext,
              parseInt(id),
              inputFieldContext,
              setBufferMessage,
              setEnableInputBox
            );
          }}
          className="absolute right-[8.6%] top-[9.5%] "
          sx={{
            position: "absolute",
            top: "9.5%",
            bottom: "9.5%",
            right: "1%",
            zIndex: 1,
          }}
        >
          {/* <SendIcon className="text-[#3884F7]" /> */}
          <img src={SendIcon} alt="send" />
        </IconButton>
        <MentionsInput
          disabled={enableInputBox}
          className="mentions"
          spellCheck="false"
          placeholder="Write a Comment..."
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              keyObj.enter = true;
            }
            if (e.key === "Shift") {
              keyObj.shift = true;
            }
            if (keyObj.enter === true && keyObj.shift === true) {
              let newStr = messageText;
              newStr += " \n ";
              setMessageText(newStr);
            } else if (keyObj.enter == true && keyObj.shift == false) {
              e.preventDefault();
              sendMessage(
                chatroomContext,
                parseInt(id),
                inputFieldContext,
                setBufferMessage,
                setEnableInputBox
              );
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              keyObj.enter = false;
            }
            if (e.key === "Shift") {
              keyObj.shift = false;
            }
          }}
          inputRef={inputBoxRef}
        >
          <Mention
            trigger="@"
            data={memberDetailsArray}
            markup="<<__display__|route://member/__id__>>"
            style={{
              backgroundColor: "#daf4fa",
            }}
            // onAdd={(id) => setActorIds((actorIds) => [...actorIds, id])}
            appendSpaceOnAdd={true}
            renderSuggestion={(
              suggestion: any,
              search,
              highlightedDisplay,
              index,
              focused
            ) => {
              return (
                <div className={`user ${focused ? "focused" : ""}`}>
                  {suggestion.imageUrl.length > 0 ? (
                    <div className="imgBlock">
                      <img src={suggestion.imageUrl} alt="profile_image" />
                    </div>
                  ) : (
                    <div className="imgBlock">
                      <span>{suggestion.display[0]}</span>
                    </div>
                  )}
                  <span
                    style={{
                      color: "#323232",
                    }}
                  >
                    {suggestion.display}
                  </span>
                </div>
              );
            }}
          />
        </MentionsInput>
      </div>
    </Box>
  );
}

function InputOptions() {
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments,
  } = inputFieldContext;
  const optionArr = [
    {
      title: "emojis",
      Icon: smiley,
    },
    {
      title: "audio",
      Icon: mic,
      file: audioAttachments,
      setFile: setAudioAttachments,
    },
    {
      title: "camera",
      Icon: camera,
      file: mediaAttachments,
      setFile: setMediaAttachments,
    },
    {
      title: "attach",
      Icon: paperclip,
      file: documentAttachments,
      setFile: setDocumentAttachments,
    },
  ];
  return (
    <Box className="flex">
      {optionArr.map((option, optionIndex) => {
        const { title, Icon, file, setFile } = option;
        let accept;
        let fileType;
        if (title === "audio") {
          accept = "audio/*";
          fileType = "audio";
        } else if (title === "camera") {
          accept = "image/*,video/*";
          fileType = "video";
        } else if (title === "attach") {
          accept = ".pdf";
          fileType = "doc";
        }
        if (title != "GIF" && title != "emojis") {
          return (
            <OptionButtonBox
              key={title}
              icon={Icon}
              accept={accept}
              setFile={setFile}
            />
          );
        } else {
          return <EmojiButton option={option} key={option.title} />;
        }
      })}
    </Box>
  );
}
function OptionButtonBox({ icon, accept, setFile }: any) {
  return (
    <IconButton>
      <label>
        <input
          type={"file"}
          style={{ display: "none" }}
          multiple
          accept={accept}
          onChange={(e) => {
            setFile(e.target.files);
          }}
        />
        <img className="w-[20px] h-[20px]" src={icon} />
      </label>
    </IconButton>
  );
}

function EmojiButton({ option }: any) {
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(null);
  const handleOpen = () => {
    setAnchorEl(ref.current);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { messageText, setMessageText } = useContext(InputFieldContext);
  return (
    <div>
      <IconButton ref={ref} onClick={handleOpen}>
        <img className="w-[20px] h-[20px]" src={option.Icon} />
      </IconButton>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <EmojiPicker
          onEmojiClick={(e) => {
            let newText = messageText;
            newText += `${e.emoji}`;
            setMessageText(newText);
          }}
        />
      </Menu>
    </div>
  );
}

export default Input;

function ImagePreview() {
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments,
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<{}>>([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of mediaAttachments) {
      if (
        nf.type.split("/")[0] === "image" ||
        nf.type.split("/")[0] === "video"
      ) {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, mediaAttachments, documentAttachments]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[0];

          if (fileTypeInitial === "image") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={URL.createObjectURL(file)} alt="preview" />
              </div>
            );
          } else if (fileTypeInitial === "video") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <video
                  src={URL.createObjectURL(file)}
                  // type="video/mp4"
                  controls
                />
              </div>
            );
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments,
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
function AudioPreview() {
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments,
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<[]>>([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of audioAttachments) {
      if (nf.type.split("/")[0] === "audio") {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, mediaAttachments, documentAttachments]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[0];

          if (fileTypeInitial === "audio") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <audio src={URL.createObjectURL(file)} controls />
              </div>
            );
          } else {
            return null;
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments,
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
function DocPreview() {
  const chatroomContext = useContext(ChatroomContext);
  const inputFieldContext = useContext(InputFieldContext);
  const {
    audioAttachments,
    setAudioAttachments,
    mediaAttachments,
    setMediaAttachments,
    documentAttachments,
    setDocumentAttachments,
  } = inputFieldContext;

  const [mediaArray, setMediaArray] = useState<Array<[]>>([]);
  useEffect(() => {
    let newArr = [];
    for (let nf of documentAttachments) {
      if (nf.type.split("/")[1] === "pdf") {
        newArr.push(nf);
      }
    }
    setMediaArray(newArr);
  }, [audioAttachments, documentAttachments, mediaAttachments]);
  return (
    <div
      style={{
        display: mediaArray.length > 0 ? "block" : "none",
      }}
    >
      <div className="w-full shadow-sm p-3 flex justify-between">
        {mediaArray.map((file: any, fileIndex) => {
          const fileTypeInitial = file.type.split("/")[1];

          if (fileTypeInitial === "pdf") {
            return (
              <div className="max-w-[120px]" key={file.name + fileIndex}>
                <img src={pdfIcon} alt="pdf" className="w-[24px]" />
              </div>
            );
          } else {
            return null;
          }
        })}
        <IconButton
          onClick={() => {
            clearInputFiles({
              setDocFiles: setDocumentAttachments,
              setMediaFiles: setMediaAttachments,
              setAudioFiles: setAudioAttachments,
            });
          }}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}
