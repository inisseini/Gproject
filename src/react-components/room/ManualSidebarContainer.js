import React, { useCallback, useContext, useEffect, useState, useRef } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import styles from "./ManualSidebarContainer.scss";

import discordBotLogo from "../../assets/images/discord-bot-logo.png";

// NOTE: context and related functions moved to ChatContext
export function ManualSidebarContainer({ onClose, scene }) {
  return (
    <Sidebar title="マニュアル" beforeTitle={<CloseButton onClick={onClose} />} disableOverflowScroll>
      <div
        style={{
          padding: "8px 16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            overflowY: "auto",
            height: "100%",
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px 0"
          }}
          className={styles.hiddenScrollBar}
        >
          <p>マニュアル</p>
        </div>
      </div>
    </Sidebar>
  );
}
