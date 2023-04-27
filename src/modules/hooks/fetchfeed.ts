import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { myClient } from "../..";
import {
  allChatroomMembersDm,
  dmChatFeed,
  getChatRoomDetails,
  log,
} from "../../sdkFunctions";
import { FeedContext } from "../contexts/feedContext";
import { GeneralContext } from "../contexts/generalContext";

type feedArrayContent = {
  header: string;
  list: Array<{}>;
};

export function useFetchFeed(
  setShouldLoadMoreHome: React.Dispatch<boolean>,
  setShouldLoadMoreAll: React.Dispatch<boolean>,
  loadMoreHome: any,
  loadMoreAll: any,
  setShouldLoadDmMoreHome: React.Dispatch<boolean>,
  setShouldLoadDmMoreAll: React.Dispatch<boolean>,
  loadDmMoreHomeFeed: any,
  loadDmMoreAllFeed: any
) {
  const { mode, operation = "", id = "" } = useParams();
  const feedContext = useContext(FeedContext);
  const generalContext = useContext(GeneralContext);
  let { homeFeed, allFeed, setHomeFeed, setAllFeed, setSecretChatrooms } =
    feedContext;
  useEffect(() => {
    async function fetchFeed() {
      try {
        switch (mode) {
          case "groups": {
            loadGroupFeed(
              setSecretChatrooms,
              homeFeed,
              setHomeFeed,
              allFeed,
              setAllFeed,
              loadMoreHome,
              setShouldLoadMoreHome,
              loadMoreAll,
              setShouldLoadMoreAll
            );
            break;
          }
          case "direct-messages": {
            fetchActiveHomeFeeds({
              setFeedList: feedContext.setDmHomeFeed,
              currentFeedList: feedContext.dmHomeFeed,
              setShouldLoadMore: setShouldLoadDmMoreHome,
            });
            fetchAllDMFeeds({
              setShouldLoadMore: setShouldLoadDmMoreAll,
              currentFeedList: feedContext.dmAllFeed,
              setFeedList: feedContext.setDmAllFeed,
            });
          }
        }
      } catch (error) {}
    }
    fetchFeed();
  }, [mode]);

  useEffect(() => {
    async function setFeeds() {
      try {
        const feedcall: any = await getChatRoomDetails(myClient, id);
        generalContext.setCurrentProfile(feedcall.data);
        generalContext.setCurrentChatroom(feedcall.data.chatroom);
      } catch (error) {
        log(error);
      }
    }

    if (id != "") {
      setFeeds();
    }
  }, [id]);
}

//fetches the current feed with secret chatrooms and returns and
type fetchActiveFeedType = {
  setShouldLoadMore: React.Dispatch<boolean> | any;
  setFeedList: React.Dispatch<Array<{}>> | any;
  currentFeedList: Array<{}>;
};

export async function fetchActiveGroupFeeds({
  setShouldLoadMore,
  setFeedList,
  currentFeedList,
}: fetchActiveFeedType) {
  try {
    const currentChatroomLength = currentFeedList.length;
    const pageNo = Math.floor(currentChatroomLength / 10) + 1;
    const call = await myClient.getHomeFeedData({
      communityId: parseInt(sessionStorage.getItem("communityId")!),
      page: pageNo,
    });
    const chatrooms = call.my_chatrooms;
    if (chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
    let newChatrooms = currentFeedList.concat(chatrooms);
    setFeedList(newChatrooms);
    return true;
  } catch (error) {
    log(`error under function fetchActiveGroupFeed: ${error} `);
    return false;
  }
}

//fetches all available feeds with secret chatrooms and returns and
type fetchAllFeedType = {
  setShouldLoadMore: React.Dispatch<boolean>;
  setFeedList: React.Dispatch<Array<{}>> | any;
  currentFeedList: Array<{}>;
};

export async function fetchAllGroupFeeds({
  setShouldLoadMore,
  setFeedList,
  currentFeedList,
}: fetchAllFeedType) {
  try {
    const currentChatroomLength = currentFeedList.length;
    const pageNo = Math.floor(currentChatroomLength / 10) + 1;
    const call = await myClient.fetchFeedData({
      community_id: parseInt(sessionStorage.getItem("communityId")!),
      page: pageNo,
      order_type: 0,
    });
    const chatrooms = call.chatrooms;
    if (chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
    let newChatrooms = currentFeedList.concat(chatrooms);
    setFeedList(newChatrooms);
    return true;
  } catch (error) {
    log(`error under function fetchAllGroupFeed: ${error} `);
    return false;
  }
}

export async function fetchActiveHomeFeeds({
  setShouldLoadMore,
  setFeedList,
  currentFeedList,
}: fetchActiveFeedType) {
  try {
    let pageNo = Math.floor(currentFeedList.length / 10) + 1;
    let call: any = await dmChatFeed(
      sessionStorage.getItem("communityId")!,
      pageNo
    );
    const chatrooms = call.data.dm_chatrooms;
    if (chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
    let newChatrooms = currentFeedList.concat(chatrooms);
    setFeedList(newChatrooms);
  } catch (error) {}
}

export async function fetchAllDMFeeds({
  setShouldLoadMore,

  currentFeedList,
  setFeedList,
}: fetchAllFeedType) {
  try {
    const currentChatroomLength = currentFeedList.length;
    const pageNo = Math.floor(currentChatroomLength / 10) + 1;
    const call: any = await allChatroomMembersDm(
      sessionStorage.getItem("communityId"),
      pageNo
    );
    const chatrooms = call.data.members;
    if (chatrooms.length < 10) {
      setShouldLoadMore(false);
    }
    let newChatrooms = currentFeedList.concat(chatrooms);
    setFeedList(newChatrooms);
    return true;
  } catch (error) {
    log(`error under function fetchAllDmFeed: ${error} `);
    return false;
  }
}

const getSecretChatroomsInvite = async (setSecretChatrooms: any) => {
  try {
    let pageNo = 1;
    let shouldCall = true;
    let res = <any>[];
    let pageSize = 10;
    while (shouldCall) {
      const call = await myClient.getInvites({
        channel_type: 1,
        page: pageNo++,
        page_size: pageSize,
      });
      const inviteArray = call.user_invites;
      res = res.concat(inviteArray);
      if (inviteArray.length < pageSize) {
        shouldCall = false;
      }
    }
    setSecretChatrooms(res);
    // callBack(res.length);
    return true;
  } catch (error) {
    log(error);
  }
};

export async function loadGroupFeed(
  setSecretChatrooms: any,
  homeFeed: any,
  setHomeFeed: any,
  allFeed: any,
  setAllFeed: any,
  loadMoreHome: any,
  setLoadMoreHome: any,
  loadMoreAll: any,
  setLoadMoreAll: any
) {
  try {
    const communityId = sessionStorage.getItem("communityId")?.toString() || "";
    homeFeed = [...homeFeed];
    allFeed = [...allFeed];
    let loadUnjoinedBool = false;
    await getSecretChatroomsInvite(setSecretChatrooms);
    if (loadMoreHome) {
      let cRooms = <any>[];
      for (let i = 0; i < 3; i++) {
        let feedLength = homeFeed.length;
        let pgNo =
          Math.floor(feedLength / 10) + 1 + Math.floor(cRooms.length / 10);
        let call = await myClient.getHomeFeedData({
          communityId: communityId,
          page: pgNo,
        });
        cRooms = cRooms.concat(call.my_chatrooms);
        if (call.my_chatrooms.length < 10) {
          setLoadMoreHome(false);
          setLoadMoreAll(true);
          loadUnjoinedBool = true;
          break;
        }
      }
      let newJoinedFeed = homeFeed.concat(cRooms);
      setHomeFeed(newJoinedFeed);
    }
    if (loadMoreAll || loadUnjoinedBool) {
      let feedLength = allFeed.length;
      let pgNo = Math.floor(feedLength / 10) + 1;
      let call = await myClient.fetchFeedData({
        community_id: parseInt(communityId),
        page: pgNo,
        order_type: 0,
      });
      if (call.chatrooms.length < 10) {
        setLoadMoreAll(false);
      }
      let newunJoinedFeed = allFeed.concat(call.chatrooms);
      setAllFeed(newunJoinedFeed);
    }
    return true;
  } catch (error) {
    log(error);
    return false;
  }
}

export const invitationResponse = async (channel_id: any, response: any) => {
  try {
    const call = await myClient.inviteAction({
      channel_id: channel_id.toString(),
      invite_status: response,
    });
  } catch (error) {
    log(error);
  }
};
