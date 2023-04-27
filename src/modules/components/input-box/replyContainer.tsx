import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { getString, log } from "../../../sdkFunctions";

type ReplyBoxType = {
  openReplyBox: boolean;
  memberName: string;
  answer: string;
  setIsSelectedConversation: any;
  setSelectedConversation: any;
  attachments?: any;
};

const ReplyBox: React.FC<ReplyBoxType> = ({
  openReplyBox,
  memberName,
  answer,
  setIsSelectedConversation,
  setSelectedConversation,
  attachments,
}: ReplyBoxType) => {
  return (
    <>
      <div
        className="w-full justify-between shadow-sm overflow-auto bg-white absolute  max-h-[250px] rounded-[5px]"
        style={{
          display: openReplyBox ? "flex" : "none",
          transform: "translate(0, -105%)",
        }}
      >
        <div className="border-l-4 border-l-green-500 px-2 text-[14px]">
          <p className="mb-3 mt-2 text-green-500">{memberName}</p>
          <div>
            {attachments != undefined ? (
              <div>
                {attachments.map((item: any) => {
                  if (item.type == "image") {
                    return (
                      <img src={item.url} className="h-[120px] w-[120px]" />
                    );
                  }
                })}
              </div>
            ) : null}
          </div>
          <div>{getString(answer)}</div>
        </div>
        <div>
          <IconButton
            onClick={() => {
              setIsSelectedConversation(false);
              setSelectedConversation({});
            }}
          >
            <Close />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default ReplyBox;
