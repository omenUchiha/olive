import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import { joinChatRoom } from "../../../sdkFunctions";
import NotFoundLogo from "./../../../assets/Icon.png";
import { groupMainPath } from "../../../routes";
import { Button } from "@mui/material";
import { GeneralContext } from "../../contexts/generalContext";

function SearchBarContainer({ searchResults, shouldShowLoading }: any) {
  const [searchArray, setSearchArray] = useState([]);
  const [shouldShowSearchScreen, setShouldShowSearchScreen] = useState(false);
  useEffect(() => {
    if (searchResults?.length > 0) {
      setSearchArray(searchResults);
    }
  });
  useEffect(() => {
    if (searchResults?.length > 0) {
      for (let obj of searchResults) {
        if (obj[Object.keys(obj)[0]].length > 0) {
          if (!shouldShowSearchScreen) {
            setShouldShowSearchScreen(true);
          }
          return () => {};
        }
      }
    }
    if (setShouldShowSearchScreen) {
      setShouldShowSearchScreen(false);
    }
  });

  return (
    <div className="max-h-[500px] w-[100%] rounded-[10px] bg-white overflow-auto">
      {shouldShowSearchScreen ? (
        <>
          {searchArray.map((item, itemIndex) => {
            let title = Object.keys(item)[0];
            return (
              <MatchFoundContainer
                matchArray={item[title]}
                key={title}
                title={title}
              />
            );
          })}
        </>
      ) : (
        <NothingFound shouldShowLoading={shouldShowLoading} />
      )}
      {/* <NothingFound/> */}
    </div>
  );
}

function MatchFoundContainer({ matchArray, title }: any) {
  if (matchArray.length > 0) {
    return <MatchTileHead matchObject={matchArray} title={title} />;
  } else return null;
}

function MatchTileHead({ matchObject, title }: any) {
  return (
    <div>
      <div
        className="text-base px-4 py-5   mt-3                     
                        h-14 w-[100%] border-b border-b-solid border-b-[#EEEEEE]
                        flex items-center
                        "
      >
        <span
          className="text-xl font-sans text-center font-semibold
                            leading-6 text-[#323232] h-6
                            "
        >
          {title}
        </span>
      </div>
      {matchObject?.map((searchItem: any, searchIndex: any) => {
        return (
          <MatchTileFields
            title={searchItem?.chatroom?.header}
            key={searchItem?.chatroom?.title + searchIndex}
            match={searchItem}
            showJoinButton={title == "Other Groups" ? true : false}
          />
        );
      })}
    </div>
  );
}

function MatchTileFields({ title, match, showJoinButton }: any) {
  const generalContext = useContext(GeneralContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const { status } = useParams();

  async function joinGroup() {
    try {
      let call = await joinChatRoom(
        match.chatroom.id,
        userContext.currentUser.id
      );
      if (!call.error) {
        navigate(groupMainPath + "/" + match.chatroom.id);
      }
    } catch (error) {
      // // console.log(error);
    }
  }
  return (
    <div
      className="flex items-center
                        px-4 py-5 bg-white
                        h-[54px] border-b border-b-solid border-b-[#EEEEEE]
                        cursor-pointer
                        justify-between"
      onClick={() => {
        navigate(groupMainPath + "/" + match.chatroom.id);
      }}
    >
      <span className="leading-[19px] font-normal text-center font-normal text-[#323232]">
        {title}
      </span>
      {showJoinButton ? (
        <Button
          sx={{
            color: "#3884F7",
          }}
          className=""
          variant="outlined"
          onClick={() => {
            joinGroup();
          }}
        >
          JOIN
        </Button>
      ) : null}
    </div>
  );
}

function NothingFound({ shouldShowLoading }: any) {
  return (
    <div className="flex justify-center items-center flex-col px-14 py-7 w-[100%] rounded-[10px] border ">
      {shouldShowLoading ? (
        <span>loading ...</span>
      ) : (
        <>
          <img src={NotFoundLogo} />
          <p className="leading-12 text-2xl text-center">
            Oops, There are no posts related to this search.
          </p>
        </>
      )}
    </div>
  );
}

export default SearchBarContainer;

// A context array for getting seacrh fields

export const SearchContext = React.createContext({
  contextArray: [],
});
