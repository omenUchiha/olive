import { Box } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  linkCss,
  linkTextCss,
  navIconCss,
} from "../../../styledAccessories/css";
import dm from "../../../assets/dm.svg";
import events from "../../../assets/events.svg";
import forum from "../../../assets/forum.svg";
import abm from "../../../assets/abm.svg";
import groups from "../../../assets/groups.svg";
import { RouteContext } from "../../contexts/routeContext";

import {
  addedByMePath,
  directMessagePath,
  eventsPath,
  forumPath,
  groupPath,
} from "../../../routes";
function Sidenav({ setOpenMenu, openMenu }) {
  const navArray = [
    {
      title: "Forums",
      path: forumPath,
      Icon: forum,
    },
    {
      title: "Groups",
      path: groupPath,
      Icon: groups,
    },
    {
      title: "Events",
      path: eventsPath,
      Icon: events,
    },
    {
      title: "Direct Messages",
      path: directMessagePath,
      Icon: dm,
    },
    {
      title: "Added By Me",
      path: addedByMePath,
      Icon: abm,
    },
  ];
  const routeContext = useContext(RouteContext);

  function toggleNavigationBar() {
    routeContext.setIsNavigationBoxOpen(!routeContext.isNavigationBoxOpen);
  }
  return (
    <div
      className={`relative ${
        openMenu ? " z:max-sm:[143px] sm:max-md:w-[241px]" : ""
      }`}
    >
      {/* <div
        className="w-[26px] h-[26px] rounded-full border border-[#EEEEEE] md:none flex justify-center items-center bg-white absolute top-2.5 right-0 translate-x-[50%]"
        onClick={toggleNavigationBar}
      >
        <img
          src={routeContext.isNavigationBoxOpen ? closeDrawer : openDrawer}
          alt="drawer state"
        />
      </div> */}
      {navArray.map((block, blockIndex) => {
        return (
          <NavBlock
            key={block.title + blockIndex}
            title={block.title}
            path={block.path}
            Icon={block.Icon}
          />
        );
      })}
    </div>
  );
}

function NavBlock({ title, Icon, path }) {
  const useNavContext = useContext(RouteContext);
  function changeCurrentPath() {
    sessionStorage.setItem("routeContext", path);
    useNavContext.setCurrentRoute(path);
    // for responsiveness
    useNavContext.setIsNavigationBoxOpen(!useNavContext.isNavigationBoxOpen);
  }
  return (
    <Link to={path} style={{ ...linkCss }} onClick={changeCurrentPath}>
      <Box className="m-auto text-center p-3">
        <Box>
          {
            <img
              src={Icon}
              style={{
                ...navIconCss,
                color:
                  useNavContext.currentRoute === path ? "#FFFFFF" : "#3884F7",
                backgroundColor:
                  useNavContext.currentRoute === path ? "#3884F7" : " #D7E6FD",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt="h"
            />
          }
        </Box>
        <span
          sx={{
            ...linkTextCss,
            fontWeight: useNavContext.currentRoute === path ? 400 : 300,
          }}
          variant="p"
        >
          {title}
        </span>
      </Box>
    </Link>
  );
}

export default Sidenav;
