import { Box } from "@mui/material";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { groupInfoPath } from "../../../routes";
import Gap from "../../../styledAccessories/Gap";
import { MoreOptions } from "../../../styledAccessories/MoreOptions";
import SearchBar from "../../../styledAccessories/SearchBar";
import { GeneralContext } from "../../contexts/generalContext";
import { log } from "../../../sdkFunctions";
type propsTitle = {
  title: any;
  memberCount?: any;
  chatroomUrl: any;
};
const Tittle = ({ title, memberCount, chatroomUrl }: propsTitle) => {
  return (
    <Box className="flex">
      <div className="w-full flex border-b border-b-[#adadad] my-0 mr-[120px] ml-[28px] pt-0 px-0 pb-[10px] shadow-none z:max-md:mr-6">
        <TitleArea
          title={title}
          memberCount={memberCount}
          chatroomUrl={chatroomUrl}
        />
        {/* <Gap /> */}
        <OptionArea />
      </div>
      <Box className="flex" />
    </Box>
  );
};

function TitleArea({ title, memberCount, chatroomUrl }: propsTitle) {
  const { mode } = useParams();
  const { id = "" } = useParams();
  return (
    <Link
      to={mode == "groups" ? groupInfoPath + "/" + id : ""}
      className="grow"
    >
      <Box className="text-left">
        {/* For Group Title */}

        <span className="font-semibold text-xl leading-6 cursor-pointer">
          {chatroomUrl && mode == "groups" ? (
            <img
              src={chatroomUrl}
              alt=""
              className="h-[40px] w-[40px] rounded inline mr-2"
            />
          ) : title?.length > 0 && mode == "groups" ? (
            <span
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                border: "0.5px solid black",
                color: "black",
                backgroundColor: "skyblue",
                borderRadius: "25%",
                padding: "8px",
                marginRight: "8px",
                height: "40px",
                width: "40px",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {title?.substring(0, 1)}
            </span>
          ) : null}
          {title ? title : ""}
        </span>

        {/* For Group Members */}
        <div />
        <span className="text-xs font-normal leading-[14.5px] text-[#ADADAD]">
          {memberCount ? memberCount + " members" : " "}
        </span>
      </Box>
    </Link>
  );
}

function OptionArea() {
  return (
    <Box>
      <SearchBar />
      <MoreOptions />
    </Box>
  );
}

export default Tittle;
