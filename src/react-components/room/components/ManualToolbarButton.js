import { ToolbarButton } from "../../input/ToolbarButton";
// TO DO: look into changing icon theme handling to work with TS
// @ts-ignore
import { ReactComponent as ManualIcon } from "../../../react-components/icons/Manual.svg";
import React, { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";
import { ToolTip } from "@mozilla/lilypad-ui";

const ManualToolbarButton = ({ onClick, selected }) => {
  const { unreadMessages } = useContext(ChatContext);
  const description = "操作を確認できます";

  return (
    <ToolTip description={description}>
      <ToolbarButton
        // Ignore type lint error as we will be redoing ToolbarButton in the future
        // @ts-ignore
        onClick={onClick}
        statusColor={unreadMessages ? "unread" : undefined}
        icon={selected ? <ManualIcon fill="#007ab8" /> : <ManualIcon fill="#ffffff" />}
        preset="accent4"
        label="マニュアル"
        selected={selected}
      />
    </ToolTip>
  );
};

export default ManualToolbarButton;
