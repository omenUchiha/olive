import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidenav from "../sidenav/Sidenav";
import { Snackbar } from "@mui/material";
import { RouteContext } from "../../contexts/routeContext";
import { GeneralContext } from "../../contexts/generalContext";
import Container from "../container";
import Header from "../header";

const Switch: React.FC = () => {
  const { mode, operation = "", id = "" } = useParams();
  const [openMenu, setOpenMenu] = useState();
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");
  const [isNavigationBoxOpen, setIsNavigationBoxOpen] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [currentChatroom, setCurrentChatroom] = useState({});
  const [currentProfile, setCurrentProfile] = useState({});
  const [chatroomUrl, setChatroomUrl] = useState("");
  return (
    <>
      <div className="flex w-[100%] h-[65px] z-10 top-0">
        {/* <Header /> */}
        <Header />
      </div>
      <GeneralContext.Provider
        value={{
          showSnackBar,
          setShowSnackBar,
          snackBarMessage,
          setSnackBarMessage,
          showLoadingBar,
          setShowLoadingBar,
          currentChatroom,
          setCurrentChatroom,
          currentProfile,
          setCurrentProfile,
          chatroomUrl,
          setChatroomUrl,
        }}
      >
        <RouteContext.Provider
          value={{
            currentRoute: mode,
            setCurrentRoute,
            isNavigationBoxOpen,
            setIsNavigationBoxOpen,
          }}
        >
          <div className="flex flex-1 customHeight">
            <div className="flex-[.085] border-r-[1px] border-[#eeeeee]">
              <Sidenav setOpenMenu={setOpenMenu} openMenu={openMenu} />
            </div>
            <div className="flex-[.915] h-full flex overflow-hidden">
              <Container />
            </div>
          </div>
          <Snackbar
            message={snackBarMessage}
            open={showSnackBar}
            autoHideDuration={3000}
            onClose={() => {
              setShowSnackBar(false);
              setSnackBarMessage("");
            }}
          />
        </RouteContext.Provider>
      </GeneralContext.Provider>
    </>
  );
};
export default Switch;
