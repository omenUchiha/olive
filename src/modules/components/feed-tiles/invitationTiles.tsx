import { useContext } from "react";
import { GeneralContext } from "../../contexts/generalContext";
import { groupMainPath } from "../../../routes";
import { Link } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import cancelIcon from "../../../assets/svg/cancel.svg";
import acceptIcon from "../../../assets/svg/accept.svg";

export default function GroupInviteTile({ title, response, id }: any) {
  const generalContext = useContext(GeneralContext);
  return (
    // <Link
    //   to={groupMainPath + "/" + id}
    //   onClick={() => {
    //     generalContext.setShowLoadingBar(true);
    //   }}

    // >
    <div
      key={id}
      className="bg-white flex justify-between py-2.5 px-5 border-t border-[#EEEEEE] cursor-pointer"
      //   style={{
      //     background: id == status ? "rgb(236, 243, 255)" : "white",
      //   }}
    >
      <Box>
        <Typography
          variant="body2"
          className="text-[#ADADAD] text-xs text-left font-normal"
        >
          You have been invited to
        </Typography>

        <Typography
          component={"p"}
          className="text-[#323232] text-base font-normal"
        >
          {title}

          <span className="bg-[#FFEFC6] rounded-[4px] px-[6px] py-[5px] text-[#F6BD2A] line-height-[12px] text-[10px] font-medium m-1">
            Private
          </span>
        </Typography>
      </Box>

      <Box>
        <IconButton
          disableRipple={true}
          onClick={() => {
            response(id, 2);
          }}
          className="cursor-pointer"
        >
          <img src={cancelIcon} alt="cancel" />
        </IconButton>

        <IconButton
          disableRipple={true}
          onClick={() => response(id, 1)}
          className="cursor-pointer"
        >
          <img src={acceptIcon} alt="accept" />
        </IconButton>
      </Box>
    </div>
    // </Link>
  );
}
