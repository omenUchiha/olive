import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { log } from "../../sdkFunctions";
import Feeds from "../components/feedlist/Feed";

type childrenType = {
  children?: any;
};

const FeedContextProvider: React.FC<childrenType> = ({
  children,
}: childrenType) => {
  const [homeFeed, setHomeFeed] = useState<Array<any>>([]);
  const [allFeed, setAllFeed] = useState<Array<any>>([]);
  const [dmHomeFeed, setDmHomeFeed] = useState<Array<any>>([]);
  const [dmAllFeed, setDmAllFeed] = useState<Array<any>>([]);
  const [secretChatrooms, setSecretChatrooms] = useState<Array<any>>([]);
  const [modeCounter, setModeCounter] = useState(0);
  const { mode } = useParams();
  const setComponent = () => {
    switch (modeCounter) {
      case 1: {
        return <Feeds />;
      }
      default:
        return null;
    }
  };
  useEffect(() => {
    setHomeFeed([]);
    setAllFeed([]);
    setSecretChatrooms([]);
    setModeCounter(0);
  }, [mode]);
  useEffect(() => {
    log("here :" + modeCounter);
    if (modeCounter == 0) {
      if (
        homeFeed.length == 0 &&
        allFeed.length == 0 &&
        secretChatrooms.length == 0
      ) {
        setModeCounter(1);
      }
    }
  });
  return (
    <FeedContext.Provider
      value={{
        homeFeed,
        allFeed,
        secretChatrooms,
        dmHomeFeed,
        dmAllFeed,
        setHomeFeed,
        setAllFeed,
        setSecretChatrooms,
        setDmHomeFeed,
        setDmAllFeed,
      }}
    >
      {setComponent()}
    </FeedContext.Provider>
  );
};

type feedContext = {
  homeFeed: Array<{}>;
  allFeed: Array<{}>;
  secretChatrooms: Array<{}>;
  dmHomeFeed: Array<{}>;
  dmAllFeed: Array<{}>;
  setHomeFeed: React.Dispatch<Array<{}>> | null;
  setAllFeed: React.Dispatch<Array<{}>> | null;
  setSecretChatrooms: React.Dispatch<Array<{}>> | null;
  setDmHomeFeed: React.Dispatch<Array<{}>> | null;
  setDmAllFeed: React.Dispatch<Array<{}>> | null;
};

export const FeedContext = React.createContext<feedContext>({
  homeFeed: [],
  allFeed: [],
  secretChatrooms: [],
  dmHomeFeed: [],
  dmAllFeed: [],
  setHomeFeed: null,
  setAllFeed: null,
  setSecretChatrooms: null,
  setDmHomeFeed: null,
  setDmAllFeed: null,
});

export default FeedContextProvider;
