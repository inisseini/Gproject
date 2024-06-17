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
          <p>
            MetaCampUs操作方法
            <br />
            <br />
            【共通】
            <br />
            <br />
            1. ブラウザを開く: お使いのパソコンで、Google Chromeを開きます。
            <br />
            2. MetaCampUsのウェブサイトにアクセス:
            ブラウザのアドレスバーにMetaCampUsのURL（https://metacampus.jp/）を入力してアクセスします。
            <br />
            3. ルームの作成または参加:
            「クリックして入場」をクリックしてエントランスワールドに入室するか、URLなどから既存のルームに参加します。
            <br />
            4.
            プロフィールの設定:初めてルームに入る際は、アイコンや表示名、プロフィール、フレンド限定表示内容、Discord通知、ニックネームなどを設定します。
            <br />
            5. アバターの選択:自分の分身であるアバターを選択します。
            <br />
            6. マイクとスピーカーの設定:マイクとスピーカーを設定します。
            <br />
            <br />
            【パソコンでの操作方法】
            <br />
            <br />
            ・移動
            <br />
            <br />
            WASDキーで移動、マウスで視点を変更します。スペースバーを押すことで着席アイコンが表示され、クリックする事で着席できます。
            <br />
            <br />
            ・UI説明
            <br />
            <br />
            招待ボタンからは他の人を招待するためのURLが発行可能です。
            <br />
            <br />
            マイクボタンから、マイクとスピーカーの変更またはミュートが行えます。
            <br />
            <br />
            共有ボタンを押すと、自分のカメラまたは画面の共有が可能です。
            <br />
            <br />
            アイテムボタンを押すことでペンやカメラ、アバターの変更、シーンの変更や画像・動画・PDF等のアップロードが可能です。
            <br />
            <br />
            リアクションボタンから、空間上に飛び出すリアクションスタンプを呼び出すことが可能です。
            <br />
            <br />
            チャットボタンから、チャットを行う事も可能です。またその際にDiscordにも送信する欄にチェックを入れる事で、Discordにも同時に送信可能です。
            <br />
            <br />
            退室ボタンから、ルームからの退室が可能です。ブラウザを閉じる事でも退室が可能です。
            <br />
            <br />
            画面右下にあるメニューボタンから、新規ルームの作成や名前とアバターの変更が可能です。また環境設定やチュートリアル、利用規約の確認も可能です。
            <br />
            <br />
            【スマートフォンでの操作方法】
            <br />
            <br />
            ・移動
            <br />
            <br />
            画面をスワイプまたは画面右に表示されている半透明のコントローラーをスワイプする事で視点を変更し、画面右に表示されている半透明のコントローラーをスワイプする事で移動します。
            <br />
            <br />
            画面をマルチタップする事で着席アイコンが表示され、タップする事で着席できます。
            <br />
            <br />
            ・UI説明
            <br />
            <br />
            マイクボタンから、マイクとスピーカーの変更またはミュートが行えます。
            <br />
            <br />
            共有ボタンを押すと、自分のカメラの共有が可能です。
            <br />
            <br />
            アイテムボタンを押すことでペンやカメラ、アバターの変更、シーンの変更や画像・動画・PDF等のアップロードが可能です。
            <br />
            <br />
            リアクションボタンから、空間上に飛び出すリアクションスタンプを呼び出すことが可能です。
            <br />
            <br />
            画面右下にあるチャットボタンから、チャットを行う事も可能です。またその際にDiscordにも送信する欄にチェックを入れる事で、Discordにも同時に送信可能です。
            <br />
            <br />
            画面左上にあるメニューボタンから、新規ルームの作成や名前とアバターの変更が可能です。また環境設定やチュートリアル、利用規約の確認も可能です。
            <br />
            <br />
            退室するには、ブラウザを閉じてください。
          </p>
        </div>
      </div>
    </Sidebar>
  );
}
