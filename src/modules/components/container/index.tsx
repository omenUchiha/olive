import { useContext } from "react";
import { useParams } from "react-router-dom";
import { log } from "../../../sdkFunctions";
import { RouteContext } from "../../contexts/routeContext";
import ChatroomWrapper from "../chatroom-container/chatroomWrapper";
import { FeedWrapper } from "../feedlist/feedWrapper";
import { GeneralContext } from "../../contexts/generalContext";
import { CircularProgress } from "@mui/material";

const Container: React.FC = () => {
  const routeContext = useContext(RouteContext);
  const generalContext = useContext(GeneralContext);
  const { operation = "" } = useParams();
  return (
    <>
      <div
        className={`flex-[.32] bg-white border-r-[1px] border-[#eeeeee] overflow-auto feed-panel relative `}
      >
        <FeedWrapper />
      </div>
      <div
        className={`flex-[.68] bg-[#FFFBF2] relative pt-[20px] flex flex-col ${
          routeContext.isNavigationBoxOpen
            ? "sm:max-md:absolute sm:max-md:z-[-1] z:max-sm:hidden"
            : "z:max-md:flex-[1]"
        }`}
      >
        {generalContext.showLoadingBar ? (
          <div className="w-full h-full absolute z-[10] items-center justify-center flex bg-inherit">
            <CircularProgress />
          </div>
        ) : null}
        <ChatroomWrapper />
      </div>
    </>
  );
};
export default Container;
