import { ToolbarButton } from "../../input/ToolbarButton";
// TO DO: look into changing icon theme handling to work with TS
// @ts-ignore
import { ReactComponent as TutorialIcon } from "../../../react-components/icons/Support.svg";
import React, { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";
import { ToolTip } from "@mozilla/lilypad-ui";

const TutorialToolbarButton = ({ onClick, selected }) => {
  const description = "チュートリアルを開始します";

  return (
    <ToolTip description={description}>
      <ToolbarButton
        // Ignore type lint error as we will be redoing ToolbarButton in the future
        // @ts-ignore
        onClick={onClick}
        icon={selected ? <TutorialIcon fill="#007ab8" /> : <TutorialIcon />}
        label="チュートリアル"
        selected={selected}
      />
    </ToolTip>
  );
};

export default TutorialToolbarButton;
