import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import filterIcon from "../../../assets/svg/menu.svg";
import searchIcon from "../../../assets/svg/searchBoxIcon.svg";
import { myClient } from "../../..";
import SearchBarContainer from "./searchbarContainer";

function Searchbar() {
  const [searchString, setSearchString] = useState("");
  const [searchResultObject, setSearchResultObject] = useState<any>([]);
  const [showSearchContainer, setShowSearchContainer] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSearchContainer(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  useEffect(() => {
    const searchTimeOut = setTimeout(async () => {
      try {
        setShouldShowLoading(true);
        let callFollowed = await myClient.searchChatroom({
          follow_status: true,
          search: searchString,
          page_size: 200,
          page: 1,
          search_type: "header",
        });
        let callUnFollowed = await myClient.searchChatroom({
          follow_status: false,
          search: searchString,
          page_size: 200,
          page: 1,
          search_type: "header",
        });
        let obj = [];
        obj[0] = {
          "Followed Groups": callFollowed.chatrooms,
        };
        obj[1] = {
          "Other Groups": callUnFollowed.chatrooms,
        };

        setSearchResultObject(obj);
        setShouldShowLoading(false);
        // // console.log(obj);
      } catch (error) {
        // // console.log(error);
      }
    }, 500);

    return () => {
      clearTimeout(searchTimeOut);
    };
  }, [searchString]);

  useEffect(() => {
    // // console.log(showSearchContainer);
  }, [showSearchContainer]);
  return (
    <div>
      <Box
        ref={ref}
        className="p-[20px] pb-6 flex justify-between relative z-10"
      >
        <TextField
          autoComplete="off"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment className="mr-[16px]" position="start">
                <img src={searchIcon} alt="Search Icon" />
              </InputAdornment>
            ),
            endAdornment:
              searchString.length > 1 ? (
                <InputAdornment className="mr-8" position="end">
                  <IconButton
                    onClick={() => setSearchResultObject(false)}
                  ></IconButton>
                </InputAdornment>
              ) : null,
            sx: {
              fontFamily: "Lato",
              borderRadius: "10px",
              border: "1px solid #EEEEEE",
              // width: "370px",
            },
            className: "bg-[#F5F5F5] font-[300] text-[14px] h-[48px] w-[100%]",
          }}
          placeholder="Search for groups"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
          onFocus={() => {
            setShowSearchContainer(true);
          }}
        />
        <div className="ml-2 hidden">
          <img src={filterIcon} alt="filter icon" />
        </div>
      </Box>
      <div
        style={{
          display:
            showSearchContainer && searchString.length > 0 ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
          height: "100%",
          width: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "9",
        }}
      ></div>
      <div
        style={{
          display:
            showSearchContainer && searchString.length > 0 ? "block" : "none",
          position: "absolute",
          zIndex: 10,
          width: "100%",
        }}
      >
        <SearchBarContainer
          searchResults={searchResultObject}
          shouldShowLoading={shouldShowLoading}
        />
      </div>
    </div>
  );
}

export default Searchbar;
