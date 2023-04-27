import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  directMessageChatPath,
  groupMainPath,
  groupPath,
} from "../../../routes";
import {
  dmChatFeed,
  getChatRoomDetails,
  log,
  markRead,
} from "../../../sdkFunctions";
import { FeedContext } from "../../contexts/feedContext";
import { GeneralContext } from "../../contexts/generalContext";
import { RouteContext } from "../../contexts/routeContext";
import {
  fetchActiveGroupFeeds,
  useFetchFeed,
  fetchAllGroupFeeds,
  fetchActiveHomeFeeds,
  loadGroupFeed,
  invitationResponse,
  fetchAllDMFeeds,
} from "../../hooks/fetchfeed";
import GroupAllFeedTile from "../feed-tiles/groupAllFeedTile";
import { GroupHomeTile } from "../feed-tiles/groupHomeTile";
import DmTile from "../feed-tiles/dmHomefeedTile";
import DmMemberTile from "../feed-tiles/DmAllMemberTiles";
import Searchbar from "../feed-search-bar";
import GroupInviteTile from "../feed-tiles/invitationTiles";
import { myClient } from "../../..";
import { onValue, ref } from "firebase/database";
import { Skeleton } from "@mui/material";
import SkeletonFeed from "../feed-skeleton";

const Feeds: React.FC = () => {
  const [loadMoreHomeFeed, setLoadMoreHomeFeed] = useState<boolean>(true);
  const [loadMoreAllFeed, setLoadMoreAllFeed] = useState<boolean>(true);
  const [loadDmMoreHomeFeed, setLoadDmMoreHomeFeed] = useState<boolean>(true);
  const [loadDmMoreAllFeed, setLoadDmMoreAllFeed] = useState<boolean>(true);
  const { mode, id } = useParams();
  const feedContext = useContext(FeedContext);
  const { homeFeed, setHomeFeed, allFeed, setAllFeed, dmHomeFeed } =
    feedContext;
  const generalContext = useContext(GeneralContext);
  const navigate = useNavigate();
  const leaveChatroomContextRefresh = async () => {
    try {
      let newHomeFeed = [];
      newHomeFeed = homeFeed.filter((group: any) => {
        return group?.chatroom?.id != id;
      });
      let newAllFeed = [];
      newAllFeed = allFeed.map((group: any) => {
        if (group.id == id) {
          group.follow_status = false;
        }
        return group;
      });
      setHomeFeed!(newHomeFeed);
      setAllFeed!(newAllFeed);
      navigate(groupPath);
    } catch (error) {
      log(error);
    }
  };
  const joinChatroomContextRefresh = async (e: any) => {
    try {
      const id = e.detail;
      const feedcall: any = await getChatRoomDetails(myClient, id);
      generalContext.setCurrentProfile(feedcall.data);
      generalContext.setCurrentChatroom(feedcall.data.chatroom);
      let newHomeFeed = [...homeFeed];
      newHomeFeed = [feedcall.data].concat(newHomeFeed);
      let newAllFeed = [];
      newAllFeed = allFeed.map((group: any) => {
        if (group.id == id) {
          group.follow_status = true;
        }
        return group;
      });
      setHomeFeed!(newHomeFeed);
      setAllFeed!(newAllFeed);
      // navigate(groupMainPath + "/" + id);
    } catch (error) {
      log(error);
    }
  };
  useFetchFeed(
    setLoadMoreHomeFeed,
    setLoadMoreAllFeed,
    loadMoreHomeFeed,
    loadMoreAllFeed,
    setLoadDmMoreHomeFeed,
    setLoadDmMoreAllFeed,
    loadDmMoreHomeFeed,
    loadDmMoreAllFeed
  );
  useEffect(() => {
    document.addEventListener("leaveEvent", leaveChatroomContextRefresh);
    document.addEventListener("joinEvent", joinChatroomContextRefresh);
    return () => {
      document.removeEventListener("leaveEvent", leaveChatroomContextRefresh);
      document.removeEventListener("joinEvent", joinChatroomContextRefresh);
    };
  });

  function getFeed() {
    switch (mode) {
      case "groups": {
        return (
          <GroupFeedContainer
            loadMoreHome={loadMoreHomeFeed}
            loadMoreAll={loadMoreAllFeed}
            setShouldLoadMoreHome={setLoadMoreHomeFeed}
            setShouldLoadMoreAll={setLoadMoreAllFeed}
          />
        );
      }

      case "direct-messages": {
        return (
          <DirectMessagesFeedContainer
            loadMoreHome={loadDmMoreHomeFeed}
            loadMoreAll={loadDmMoreAllFeed}
            setShouldLoadMoreHome={setLoadDmMoreHomeFeed}
            setShouldLoadMoreAll={setLoadDmMoreAllFeed}
          />
        );
      }
    }
  }

  return (
    <>
      <Searchbar />
      {getFeed()}
    </>
  );
};

export default Feeds;

function GroupFeedContainer({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) {
  const { id = "", mode } = useParams();
  const feedContext = useContext(FeedContext);
  const generalContext = useContext(GeneralContext);
  const routeContext = useContext(RouteContext);
  const {
    secretChatrooms,
    setSecretChatrooms,
    homeFeed,
    setHomeFeed,
    allFeed,
    setAllFeed,
  } = feedContext;
  const navigate = useNavigate();
  async function refreshHomeFeed() {
    try {
      const communityId = sessionStorage.getItem("communityId");
      let groupHomeFeedCall: any = await myClient.getHomeFeedData({
        communityId: communityId!,
        page: 1,
      });
      if (homeFeed.length < 10) {
        setHomeFeed!(groupHomeFeedCall.my_chatrooms);
      } else {
        let newHomeFeed = groupHomeFeedCall.my_chatrooms;
        const firstFeedEl: any = homeFeed[0];
        const firstFeedId = firstFeedEl?.chatroom.id;
        let index;
        for (let ind in newHomeFeed) {
          if (newHomeFeed[ind]?.chatroom?.id == firstFeedId) {
            index = ind;
            break;
          }
        }
        let newFeedFirstHalf = newHomeFeed.slice(0, index);
        let newFeedFirstHalfIDs = newFeedFirstHalf.map((item: any) => {
          return item.chatroom.id;
        });
        let oldFeed = homeFeed.map((item: any) => {
          if (newFeedFirstHalfIDs.includes(item.chatroom.id)) {
            return null;
          } else {
            return item;
          }
        });
        let newFeedRestHalf = oldFeed.filter((item) => {
          return item != null;
        });
        newHomeFeed = newFeedFirstHalf.concat(newFeedRestHalf);
        setHomeFeed!(newHomeFeed);
      }
    } catch (error) {
      log(error);
    }
  }
  function localRefreshHomeFeed(e: any) {
    let topFeed: any = [];
    let newHomeFeed = homeFeed.filter((item: any) => {
      if (item.chatroom.id == e.detail) {
        topFeed.push(item);
      }
      return item.chatroom.id != e.detail;
    });
    newHomeFeed = topFeed.concat(newHomeFeed);
    setHomeFeed!(newHomeFeed);
  }
  useEffect(() => {
    if (mode == "groups" && id == "") {
      if (id == undefined) {
        return;
      }
      let chatroomObject: any = homeFeed[0];
      let chatroomId = chatroomObject?.chatroom?.id;
      if (chatroomId == undefined) {
        return;
      }
      navigate(groupMainPath + "/" + chatroomId);
    }
  }, [homeFeed]);
  const fb = myClient.fbInstance();
  useEffect(() => {
    const communityId = sessionStorage.getItem("communityId");
    let query = ref(fb, `community/${communityId}`);
    return onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        let chatroomId = snapshot.val()["chatroom_id"];
        if (chatroomId != id) refreshHomeFeed();
      }
    });
  }, [id]);
  useEffect(() => {
    document.addEventListener("sentMessage", localRefreshHomeFeed);
    return () => {
      document.removeEventListener("sentMessage", localRefreshHomeFeed);
    };
  });
  return (
    <div
      id="home-feed-container"
      className="max-h-[100%] overflow-auto border-b border-solid border-[#EEEEEE]"
    >
      <InfiniteScroll
        hasMore={loadMoreHome || loadMoreAll}
        next={() => {
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
        }}
        dataLength={homeFeed.length + secretChatrooms.length + allFeed.length}
        loader={null}
        scrollableTarget="home-feed-container"
      >
        {allFeed.length === 0 ? (
          <SkeletonFeed />
        ) : (
          <>
            {secretChatrooms.map((group: any) => {
              return (
                <GroupInviteTile
                  title={group.chatroom.header}
                  id={group.chatroom.id}
                  response={invitationResponse}
                />
              );
            })}
            {homeFeed.map((group: any, groupIndex) => {
              return (
                <Link
                  to={groupMainPath + "/" + group?.chatroom?.id}
                  onClick={() => {
                    if (id != group.chatroom.id) {
                      generalContext.setChatroomUrl(
                        group?.chatroom?.chatroom_image_url!
                      );
                      generalContext.setShowLoadingBar(true);
                    }
                    routeContext.setIsNavigationBoxOpen(
                      !routeContext.isNavigationBoxOpen
                    );
                  }}
                  key={group.chatroom.id + groupIndex + group.chatroom.header}
                >
                  <GroupHomeTile
                    key={group.chatroom.id + groupIndex}
                    groupTitle={group.chatroom.header}
                    chatroomId={group.chatroom.id}
                    isSecret={group.chatroom.is_secret}
                    unseenConversationCount={group.unseen_conversation_count}
                  />
                </Link>
              );
            })}
            <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
              <span>{"All Members"}</span>
            </div>
            {allFeed.map((group: any) => {
              return (
                <GroupAllFeedTile
                  groupTitle={group.header}
                  chatroomId={group.id}
                  followStatus={group.follow_status}
                  key={group.id}
                />
              );
            })}
          </>
        )}
      </InfiniteScroll>
    </div>
  );
}

function DirectMessagesFeedContainer({
  loadMoreHome,
  loadMoreAll,
  setShouldLoadMoreHome,
  setShouldLoadMoreAll,
}: any) {
  const { mode, id = "" } = useParams();
  const feedContext = useContext(FeedContext);
  const { dmHomeFeed, setDmHomeFeed, dmAllFeed, setDmAllFeed } = feedContext;
  const navigate = useNavigate();
  const db = myClient.fbInstance();
  const allFeed = dmAllFeed;
  const setAllFeed = setDmAllFeed;
  async function refreshHomeFeed() {
    try {
      const communityId = sessionStorage.getItem("communityId");
      let call: any = await dmChatFeed(communityId!, 1);
      const chatrooms = call.data.dm_chatrooms;
      if (dmHomeFeed.length < 10) {
        setDmHomeFeed!(chatrooms);
      } else {
        let newHomeFeed = chatrooms;
        const firstFeedEl: any = dmHomeFeed[0];
        const firstFeedId = firstFeedEl?.chatroom.id;
        let index;
        for (let ind in newHomeFeed) {
          if (newHomeFeed[ind]?.chatroom?.id == firstFeedId) {
            index = ind;
            break;
          }
        }
        let newFeedFirstHalf = newHomeFeed.slice(0, index);
        let newFeedFirstHalfIDs = newFeedFirstHalf.map((item: any) => {
          return item.chatroom.id;
        });
        let oldFeed = dmHomeFeed.map((item: any) => {
          if (newFeedFirstHalfIDs.includes(item.chatroom.id)) {
            return null;
          } else {
            return item;
          }
        });
        let newFeedRestHalf = oldFeed.filter((item) => {
          return item != null;
        });
        newHomeFeed = newFeedFirstHalf.concat(newFeedRestHalf);
        setDmHomeFeed!(newHomeFeed);
      }
    } catch (error) {
      log(error);
    }
  }
  useEffect(() => {
    log(id);
    if (mode == "direct-messages" && id == "") {
      console.log("the id is : " + id);

      let chatroomObject: any = dmHomeFeed[0];
      let chatroomIds = chatroomObject?.chatroom?.id;
      if (chatroomIds == undefined) {
        return;
      }
      navigate(directMessageChatPath + "/" + chatroomIds);
    }
  }, [dmHomeFeed]);
  useEffect(() => {
    const query = ref(db, "collabcards");
    onValue(query, (snapshot) => {
      if (snapshot.exists()) {
        refreshHomeFeed();
        // }
      }
    });
  }, [id]);
  return (
    <>
      <div
        id="home-feed-container"
        className="min-h-[350px] max-h-[400px] overflow-auto border-b border-solid border-[#EEEEEE]"
      >
        {dmHomeFeed.length > 0 ? (
          <InfiniteScroll
            hasMore={loadMoreHome}
            next={() => {
              fetchActiveHomeFeeds({
                setShouldLoadMore: setShouldLoadMoreHome,
                currentFeedList: dmHomeFeed,
                setFeedList: setDmHomeFeed,
              });
            }}
            dataLength={dmHomeFeed.length}
            loader={null}
            scrollableTarget="home-feed-container"
          >
            {dmHomeFeed.map((group: any) => {
              return <DmTile key={group.chatroom.id} profile={group} />;
            })}
          </InfiniteScroll>
        ) : (
          <SkeletonFeed />
        )}
      </div>
      <div className="flex justify-between text-[20px] mt-[10px] py-4 px-5 items-center">
        <span>{mode === "groups" ? "All Public Groups" : "All Members"}</span>
      </div>
      <div className="max-h-[400px] overflow-auto" id="all-feed-container">
        {dmAllFeed.length > 0 ? (
          <InfiniteScroll
            loader={null}
            dataLength={allFeed.length}
            hasMore={loadMoreAll}
            scrollableTarget="all-feed-container"
            next={() => {
              fetchAllDMFeeds({
                setShouldLoadMore: setShouldLoadMoreAll,
                currentFeedList: allFeed,
                setFeedList: setAllFeed,
              });
            }}
          >
            {allFeed.map((group: any) => {
              return <DmMemberTile key={group.id} profile={group} />;
            })}
          </InfiniteScroll>
        ) : (
          <SkeletonFeed />
        )}
      </div>
    </>
  );
}
