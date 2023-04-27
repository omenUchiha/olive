import React, { useContext, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Snackbar } from "@mui/material";
import {
  getChatRoomDetails,
  getConversationsForGroup,
  leaveChatRoom,
  leaveSecretChatroom,
  log,
} from "../sdkFunctions";

import { myClient } from "..";
import { UserContext } from "../modules/contexts/userContext";
import leaveIcon from "../assets/svg/leave.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  directMessageInfoPath,
  directMessagePath,
  groupMainPath,
} from "../routes";
import ChatroomContext from "../modules/contexts/chatroomContext";
import { GeneralContext } from "../modules/contexts/generalContext";
import { leaveChatroomContextRefresh } from "../modules/hooks/fetchfeed";
import { FeedContext } from "../modules/contexts/feedContext";

export function MoreOptions() {
  const [open, setOpen] = useState(false);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  const generalContext = useContext(GeneralContext);
  function closeMenu() {
    setOpen(false);
    setAnchor(null);
  }
  async function muteNotifications(id) {
    try {
      let call = await myClient.muteNotification({
        chatroom_id: generalContext.currentChatroom.id,
        value: id == 6 ? true : false,
      });
      closeMenu();
      let refreshCall = await getChatRoomDetails(
        myClient,
        generalContext.currentChatroom.id
      );
      generalContext.setCurrentProfile(refreshCall.data);
      generalContext.setCurrentChatroom(refreshCall.data.chatroom);
    } catch (error) {
      log(error);
    }
  }

  async function leaveGroup() {
    try {
      if (!!generalContext.currentChatroom.is_secret) {
        await leaveSecretChatroom(
          generalContext.currentChatroom.id,
          userContext.currentUser.id
        );
      } else {
        await leaveChatRoom(
          generalContext.currentChatroom.id,
          userContext.currentUser.id
        );
      }
      return generalContext.currentChatroom.id;
    } catch (error) {
      log(error);
    }
  }

  const MenuBox = (
    <Menu
      anchorEl={anchor}
      onClose={() => {
        closeMenu();
      }}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {generalContext.currentProfile?.chatroom_actions?.map((item) => {
        if (item.id === 2) {
          return null;
        }
        return (
          <MenuItem
            key={item.id}
            onClick={() => {
              if (item.id === 6 || item.id === 8) {
                muteNotifications(item.id);
              } else if (item.id === 15 || item.id == 9) {
                leaveGroup().then((id) => {
                  let leaveEvent = new CustomEvent("leaveEvent");
                  document.dispatchEvent(leaveEvent);
                });
              }
            }}
            sx={{
              fontSize: "14px",
              color: "#323232",
            }}
          >
            <img src={leaveIcon} alt="leave" className="mr-2" />
            {item.title}
          </MenuItem>
        );
      })}
    </Menu>
  );
  return (
    <span>
      <IconButton
        onClick={(e) => {
          setAnchor(e.currentTarget);
          setOpen(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      {MenuBox}
    </span>
  );
}

export function MoreOptionsDM() {
  const [open, setOpen] = useState(false);
  const chatroomContext = useContext(ChatroomContext);
  const generalContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const [anchor, setAnchor] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  function closeMenu() {
    setOpen(false);
    setAnchor(null);
  }

  let navigate = useNavigate();
  function leaveGroup() {
    leaveChatRoom(generalContext.currentChatroom.id, userContext.currentUser.id)
      .then((r) => {
        generalContext.setCurrentChatroom({});
        navigate(directMessagePath);
      })
      .catch((r) => {
        log(r);
      });
  }

  async function muteNotifications(id) {
    try {
      let call = await myClient.muteNotification({
        chatroom_id: generalContext.currentChatroom.id,
        value: id == 6 ? true : false,
      });

      closeMenu();
      let refreshCall = await getChatRoomDetails(
        myClient,
        generalContext.currentChatroom.id
      );
      generalContext.setCurrentChatroom(refreshCall.data.chatroom);
      generalContext.setCurrentProfile(refreshCall.data);
      setShowSnackBar(true);
      setSnackbarMessage("Notifications " + (id == 6 ? "muted" : "unmuted"));
    } catch (error) {
      // // console.log(error);
    }
  }
  async function block(id) {
    let call = await myClient.blockCR({
      chatroom_id: generalContext.currentChatroom.id,
      status: id === 27 ? 0 : 1,
    });
    closeMenu();
    // let callRefresh = await getChatroomConversations(
    //   generalContext.currentChatroom.id,
    //   100,
    //   generalContext
    // );

    let callChatroomRefresh = await getChatRoomDetails(
      myClient,
      generalContext.currentChatroom.id
    );
    generalContext.setCurrentChatroom(callChatroomRefresh.data.chatroom);
    generalContext.setCurrentProfile(callChatroomRefresh.data);
  }

  const MenuBox = (
    <Menu
      anchorEl={anchor}
      onClose={() => {
        closeMenu();
      }}
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {generalContext.currentProfile.chatroom_actions.map(
        (option, optionIndex) => {
          return (
            <MenuItem
              key={option.id}
              onClick={() => {
                if (option.id === 6 || option.id === 8) {
                  muteNotifications(option.id);
                } else if (option.id == 27) {
                  block(option.id);
                } else {
                  navigate(directMessageInfoPath, {
                    state: {
                      memberId:
                        userContext.currentUser.id ===
                        chatroomContext.currentChatroom.member.id
                          ? chatroomContext.currentChatroom.chatroom_with_user
                              .id
                          : chatroomContext.currentChatroom.member.id,
                      communityId: userContext.community.id,
                    },
                  });
                }
              }}
              sx={{
                fontSize: "14px",
                color: "#323232",
              }}
            >
              {/* <img src={leaveIcon} alt="leave" className="mr-2" /> */}
              {option.title}
            </MenuItem>
          );
        }
      )}
    </Menu>
  );
  return (
    <span
      style={{
        display:
          generalContext.currentChatroom.chat_request_state == 0
            ? "none"
            : "inline",
      }}
    >
      <Snackbar
        open={showSnackBar}
        onClose={() => {
          setShowSnackBar(false);
        }}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
      <IconButton
        onClick={(e) => {
          setAnchor(e.currentTarget);
          setOpen(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
      {MenuBox}
    </span>
  );
}
