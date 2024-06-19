import React, { useCallback, useContext, useEffect, useState, useRef } from "react";

import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import "./ManualSidebarContainer.css";

import discordBotLogo from "../../assets/images/discord-bot-logo.png";

import manual1 from "../../assets/images/manual1.png";
import manual2 from "../../assets/images/manual2.png";
import manual3 from "../../assets/images/manual3.png";
import manual4 from "../../assets/images/manual4.png";
import manual5 from "../../assets/images/manual5.png";
import manual6 from "../../assets/images/manual6.png";

const sections = ["操作方法", "アバター", "Discord"];

const content = {
  mobile: {
    操作方法: (
      <div>
        <h2>画面UIの説明</h2>
        <img src={manual1} alt="Manual1" />
        <br />
        <br />
        ①招待　他ユーザーを自分が今滞在しているワールドに招待する事が出来るルームリンクを発行、コピーできます。
        <br />
        <br />
        ②マイク・スピーカー設定　マイク及びスピーカーの機器設定、確認及びテストが可能です。また、マイクのボタンを押すことでミュートに切り替えることが可能です。
        <br />
        <br />
        ③チャット　チャット機能の利用が可能です。クリックすると画面右側にワールド全体に共有できるチャット欄があらわれます。
        <br />
        <br />
        ④ チュートリアル　簡単な操作方法の確認を行い事が可能です。
        <br />
        <br />
        ⑤マニュアル　詳細な操作方法やMetaCampUsに関して確認する事が可能です。
        <br />
        <br />
        ⑥退室　ワールドから抜けることが出来ます。
        <br />
        <br />
        ⑦メニュー　MetaCampUsにおけるアカウント設定やルーム・アバターの設定、プロフィール等の確認が可能です。
        <br />
        <br />
        <h2>操作方法</h2>
        ・アバターの移動
        <br />
        ピンチアウト・ピンチインで操作可能です。ピンチアウトで前進、ピンチインで後退します。
        <br />
        <br />
        ・アバターの視点変更
        <br />
        画面をスワイプする事で左右上下に視点を変更する事が可能です。
        <br />
        <br />
        ・椅子への座り方
        <br />
        椅子へ視点を向けた状態で、スマホの画面を二本指で同時に押すことで着席出来るスポットが表示されます。スポットをクリックする事で着席が可能です。その後、再度二本指で同時に押すことでスポットを削除する事が可能です。
        <br />
        <br />
        ・オブジェクトの掴み方
        <br />
        持てるオブジェクトをタップすると青く光ります。その状態で持ち上げる事でオブジェクトを掴むことが可能です。
        <br />
        <br />
        ・画面の共有方法
        <br />
        共有ボタンから共有する画面を選択する事で、目の前に共有された画面が出現します。
        そのオブジェクトをモニターオブジェクトに近づける事で設置が可能です。
      </div>
    ),
    アバター: (
      <div>
        <h2>アバターの変更方法</h2>
        ①プリセットアバターの変更
        <br />
        <img src={manual2} alt="Manual2" />
        <br />
        <br />
        部屋に入出時に表示されるアバター変更ボタンから変更が可能です。
        <br />
        アバター変更ボタンを押すと、以下の様に6体のプリセットアバターが出現する為、任意のアバターを選択して入場してください。
        <img src={manual3} alt="Manual3" />
        <br />
        <br />
        ②オリジナルアバターの追加
        <br />
        オリジナルアバターの作成には、
        <a href="https://minecraft.novaskin.me" target="_blank" rel="noopener noreferrer">
          NOVASKIN
        </a>
        または
        <a href="https://www.minecraftskins.com/search/skin/skincraft/1/" target="_blank" rel="noopener noreferrer">
          SKINCRAFT
        </a>
        をといったアバター作成ソフトを使用してスキンを作成、ダウンロードしてください。使用方法に関しては各サイトをご参照ください。
        <br />
        作成したアバターを追加するには、アバターの選択画面の一番左にある、アバターの作成を選択してください。
        <br />
        <img src={manual4} alt="Manual4" />
        <br />
        <br />
        画面中段にあるスキン項目のBase Mapを選択し、ファイルから作成したスキンを選択し、保存を押すと作成が完了します。
      </div>
    ),
    Discord: (
      <div>
        <h2>参加方法</h2>
        DiscordのMetaCampUsサーバーに参加するには、
        <a href="https://discord.gg/JvwZfUnUeV" target="_blank" rel="noopener noreferrer">
          MetaCampUsの招待リンク
        </a>
        をクリックしてください。
        <br />
        クリックすると、Dircordアプリまたはwebブラウザが展開されます。ログインしていない場合は、ログインを行うとサーバーへ参加する事が可能です。
        <br />
        <br />
        サーバーに参加した直後は、閲覧できるチャンネルがコミュニティ憲章、MetaCampUsマニュアル、アカウント申請のみとなっています。
        <br />
        まずはアカウント申請チャンネルから、
        <br />
        <br /> 名前： <br />
        大学名： <br />
        メールアドレス：
        <br />
        <br />
        の3点を記入して申請を行ってください。Metacampus運営によって申請が受理され次第、studentsという権限が与えられチャンネルの閲覧や書き込みが可能になります。
        <br />
        <br />
        <h2>画面UIの説明</h2>
        <img src={manual5} alt="Manual5" />
        <br />
        <br />
        ① チャット欄　文章によるチャットを行う事が可能です。
        <br />
        <br />
        ②マイクミュート　音声通話をしている場合、マイクをミュートにすることが可能です。
        <br />
        <br />
        ③スピーカーミュート　　音声通話をしている場合、スピーカーをミュートにすることが可能です。
        <br />
        <br />
        ④GIF、スタンプ、絵文字　チャットにて使用する事が可能なGIF、スタンプ、絵文字を選択出来ます。
        <br />
        <br />
        ⑤ チャンネル　参加しているテキストチャンネルを切り替えることが可能です。
        <br />
        <br />
        ⑥ボイスチャンネル　参加しているボイスチャンネルを切り替えることが可能です。
        <br />
        <br />⑦ ダイレクトメッセージ　フレンドに直接メッセージを送る事が可能です。 <br />
        <br />
        ⑧サーバー　参加しているサーバーを切り替えることが可能です。
        <h2>チャンネルに関して</h2>
        <img src={manual6} alt="Manual6" />
        <br />
        <br />
        01_WELCOMEカテゴリー <br />
        ・コミュニティ憲章
        <br />
        MetaCampUs(以下MetaCampUs）公式サーバーのルールに関して掲載しています。閲覧のみ可能です。
        <br />
        <br />
        ・MetaCampUsマニュアル
        <br />
        MetaCampUsの操作方法に関して記載しています。閲覧のみ可能です。
        <br />
        <br />
        02_TALK
        <br />
        ・アナウンス
        <br />
        MetaCampUsに関するアナウンスが流れます。閲覧のみ可能です。
        <br />
        ・自己紹介
        <br />
        Students以上の全参加者が書き込み可能です。自身に関して紹介してください。
        <br />
        ・雑談
        <br />
        起業に関する相談など自由に発言して頂けます。
        <br />
        <br />
        03_INFORMATION
        <br />
        ・システム報告
        <br />
        システムアップデートや不具合などの告知が行われます。
        <br />
        ・入室
        <br />
        Metacampusに誰が入室したのかの確認が行えます。
        <br />
        ・画像共有
        <br />
        Metacampus上で行われた画像などが反映されます。
        <br />
        <br />
        ・ボイスチャンネル
        <br />
        音声によるコミュニケーションが可能です。
        <br />
        <br />
        OPERATIOM
        <br />
        ・アカウント申請
        <br />
        Discordサーバーに初めて加わった際にユーザー登録を申請するチャンネルです。形式に沿って申請してください。
      </div>
    )
  },
  pc: {
    操作方法: (
      <div>
        <h2>画面UIの説明</h2>
        <img src={manual1} alt="Manual1" />
        <br />
        <br />
        ①招待　他ユーザーを自分が今滞在しているワールドに招待する事が出来るルームリンクを発行、コピーできます。
        <br />
        <br />
        ②マイク・スピーカー設定　マイク及びスピーカーの機器設定、確認及びテストが可能です。また、マイクのボタンを押すことでミュートに切り替えることが可能です。
        <br />
        <br />
        ③チャット　チャット機能の利用が可能です。クリックすると画面右側にワールド全体に共有できるチャット欄があらわれます。
        <br />
        <br />
        ④ チュートリアル　簡単な操作方法の確認を行い事が可能です。
        <br />
        <br />
        ⑤マニュアル　詳細な操作方法やMetaCampUsに関して確認する事が可能です。
        <br />
        <br />
        ⑥退室　ワールドから抜けることが出来ます。
        <br />
        <br />
        ⑦メニュー　MetaCampUsにおけるアカウント設定やルーム・アバターの設定、プロフィール等の確認が可能です。
        <br />
        <br />
        <h2>操作方法</h2>
        ・アバターの移動
        <br />
        キーボードのWASDキーで操作可能です。Wキーで前進、Sキーで後退、Aキーで左、Dキーで右に移動可能です。
        またキーボードの↑↓→←ボタンでも同様の操作が可能です。 <br />
        <br />
        ・アバターの視点変更
        <br />
        左クリックを押した状態で左右に動かすことで視点の変更が可能です。
        またQキーで左、Eキーで右に15度づつ回転可能です。 <br />
        <br />
        ・椅子への座り方
        <br />
        椅子へ視点を向けた状態で、キーボードのスペースキーを押すことで着席出来るスポットが表示されます。スポットをクリックする事で着席が可能です。
        <br />
        <br />
        ・オブジェクトの掴み方
        <br />
        持てるオブジェクトにカーソルを当てると青く光ります。その状態で左クリックしたまま持ち上げる事でオブジェクトを掴むことが可能です。
        <br />
        <br />
        ・画面の共有方法
        <br />
        共有ボタンから共有する画面を選択する事で、目の前に共有された画面が出現します。
        そのオブジェクトをモニターオブジェクトに近づける事で設置が可能です。
        <br />
        <br />
        ・自分のアバターの確認方法
        <br />
        Iキーで自身のアバターを確認する事が可能です。
      </div>
    ),
    アバター: (
      <div>
        <h2>アバターの変更方法</h2>
        ①プリセットアバターの変更
        <br />
        <img src={manual2} alt="Manual2" />
        <br />
        <br />
        部屋に入出時に表示されるアバター変更ボタンから変更が可能です。
        <br />
        アバター変更ボタンを押すと、以下の様に6体のプリセットアバターが出現する為、任意のアバターを選択して入場してください。
        <img src={manual3} alt="Manual3" />
        <br />
        <br />
        ②オリジナルアバターの追加
        <br />
        オリジナルアバターの作成には、
        <a href="https://minecraft.novaskin.me" target="_blank" rel="noopener noreferrer">
          NOVASKIN
        </a>
        または
        <a href="https://www.minecraftskins.com/search/skin/skincraft/1/" target="_blank" rel="noopener noreferrer">
          SKINCRAFT
        </a>
        をといったアバター作成ソフトを使用してスキンを作成、ダウンロードしてください。使用方法に関しては各サイトをご参照ください。
        <br />
        作成したアバターを追加するには、アバターの選択画面の一番左にある、アバターの作成を選択してください。
        <br />
        <img src={manual4} alt="Manual4" />
        <br />
        <br />
        画面中段にあるスキン項目のBase Mapを選択し、ファイルから作成したスキンを選択し、保存を押すと作成が完了します。
      </div>
    ),
    Discord: (
      <div>
        <h2>参加方法</h2>
        DiscordのMetaCampUsサーバーに参加するには、
        <a href="https://discord.gg/JvwZfUnUeV" target="_blank" rel="noopener noreferrer">
          MetaCampUsの招待リンク
        </a>
        をクリックしてください。
        <br />
        クリックすると、Dircordアプリまたはwebブラウザが展開されます。ログインしていない場合は、ログインを行うとサーバーへ参加する事が可能です。
        <br />
        <br />
        サーバーに参加した直後は、閲覧できるチャンネルがコミュニティ憲章、MetaCampUsマニュアル、アカウント申請のみとなっています。
        <br />
        まずはアカウント申請チャンネルから、
        <br />
        <br /> 名前： <br />
        大学名： <br />
        メールアドレス：
        <br />
        <br />
        の3点を記入して申請を行ってください。Metacampus運営によって申請が受理され次第、studentsという権限が与えられチャンネルの閲覧や書き込みが可能になります。
        <br />
        <br />
        <h2>画面UIの説明</h2>
        <img src={manual5} alt="Manual5" />
        <br />
        <br />
        ① チャット欄　文章によるチャットを行う事が可能です。
        <br />
        <br />
        ②マイクミュート　音声通話をしている場合、マイクをミュートにすることが可能です。
        <br />
        <br />
        ③スピーカーミュート　　音声通話をしている場合、スピーカーをミュートにすることが可能です。
        <br />
        <br />
        ④GIF、スタンプ、絵文字　チャットにて使用する事が可能なGIF、スタンプ、絵文字を選択出来ます。
        <br />
        <br />
        ⑤ チャンネル　参加しているテキストチャンネルを切り替えることが可能です。
        <br />
        <br />
        ⑥ボイスチャンネル　参加しているボイスチャンネルを切り替えることが可能です。
        <br />
        <br />⑦ ダイレクトメッセージ　フレンドに直接メッセージを送る事が可能です。 <br />
        <br />
        ⑧サーバー　参加しているサーバーを切り替えることが可能です。
        <h2>チャンネルに関して</h2>
        <img src={manual6} alt="Manual6" />
        <br />
        <br />
        01_WELCOMEカテゴリー <br />
        ・コミュニティ憲章
        <br />
        MetaCampUs(以下MetaCampUs）公式サーバーのルールに関して掲載しています。閲覧のみ可能です。
        <br />
        <br />
        ・MetaCampUsマニュアル
        <br />
        MetaCampUsの操作方法に関して記載しています。閲覧のみ可能です。
        <br />
        <br />
        02_TALK
        <br />
        ・アナウンス
        <br />
        MetaCampUsに関するアナウンスが流れます。閲覧のみ可能です。
        <br />
        ・自己紹介
        <br />
        Students以上の全参加者が書き込み可能です。自身に関して紹介してください。
        <br />
        ・雑談
        <br />
        起業に関する相談など自由に発言して頂けます。
        <br />
        <br />
        03_INFORMATION
        <br />
        ・システム報告
        <br />
        システムアップデートや不具合などの告知が行われます。
        <br />
        ・入室
        <br />
        Metacampusに誰が入室したのかの確認が行えます。
        <br />
        ・画像共有
        <br />
        Metacampus上で行われた画像などが反映されます。
        <br />
        <br />
        ・ボイスチャンネル
        <br />
        音声によるコミュニケーションが可能です。
        <br />
        <br />
        OPERATIOM
        <br />
        ・アカウント申請
        <br />
        Discordサーバーに初めて加わった際にユーザー登録を申請するチャンネルです。形式に沿って申請してください。
      </div>
    )
  }
};

// NOTE: context and related functions moved to ChatContext
export function ManualSidebarContainer({ onClose, scene }) {
  const [isMobile, setIsMobile] = useState(true);
  const [selectedSection, setSelectedSection] = useState("操作方法");

  const handleToggle = () => {
    setIsMobile(!isMobile);
  };

  const handleSectionChange = event => {
    setSelectedSection(event.target.value);
  };

  return (
    <Sidebar title="マニュアル" beforeTitle={<CloseButton onClick={onClose} />} disableOverflowScroll>
      <header className="header">
        <nav className="section-nav">
          <select value={selectedSection} onChange={handleSectionChange}>
            {sections.map(section => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </nav>
        <div className="toggle-switch">
          <label>
            <input type="checkbox" checked={isMobile} onChange={handleToggle} />
            <span className="slider"></span>
            {isMobile ? "スマホ用" : "スマホ用"}
          </label>
        </div>
      </header>
      <main className="content">
        <div>{isMobile ? content.mobile[selectedSection] : content.pc[selectedSection]}</div>
      </main>
    </Sidebar>
  );
}
