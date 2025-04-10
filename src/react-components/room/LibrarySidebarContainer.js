import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
// import libraryDataCsvPath from '../../assets/libraryData/libraryData.csv'; // CSVインポート削除
// console.log('Imported CSV Path:', libraryDataCsvPath); // CSVログ削除
import libraryData from "../../assets/libraryData/libraryData.json"; // JSONファイルをインポート
console.log("ライブラリ：Imported libraryData:", libraryData); // ★ログ追加: インポート直後のデータ確認

import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { TextAreaInput } from "../input/TextAreaInput";
import styles from "./LibrarySidebarContainer.scss";

import GTIE1 from "../../assets/images/GTIE1.png";
import GTIE2 from "../../assets/images/GTIE2.png";
import GTIE3 from "../../assets/images/GTIE3.png";
import GTIE4 from "../../assets/images/GTIE4.png";
import GTIE5 from "../../assets/images/GTIE5.png";
import GTIE6 from "../../assets/images/GTIE6.png";
import GTIE7 from "../../assets/images/GTIE7.png";
import GTIE8 from "../../assets/images/GTIE8.png";
import Article from "../../assets/images/library-article.png";
import Video from "../../assets/images/library-video.png";

// NOTE: context and related functions moved to ChatContext
export function LibrarySidebarContainer({ onClose, scene, setQuestion }) {
  const ref = useRef();
  const [searchWord, setWord] = useState("");
  const [searchTag, setTag] = useState("");
  const [searchCategory1, setCategory1] = useState("default");
  const [searchCategory2, setCategory2] = useState("default");
  const [libraryDataState, setLibraryDataState] = useState([]);
  const [categories1, setCategories1] = useState([]);
  const [categories2, setCategories2] = useState([]);

  // CSVをパースするヘルパー関数 parseCSV は不要になったので削除
  // const parseCSV = (csvText) => { ... };

  // コンポーネントマウント時にJSONデータを処理する useEffect
  useEffect(() => {
    console.log("ライブラリ：useEffect - start"); // ★ログ追加: useEffect 開始
    // インポートしたJSONデータを直接セット
    setLibraryDataState(libraryData);
    console.log("ライブラリ：useEffect - setLibraryDataState called"); // ★ログ追加: state更新関数呼び出し確認
    // ★注意: ここで libraryData state をログ出力しても、非同期のためすぐには反映されていない可能性があります

    // カテゴリ1のリストを生成 (重複排除) - インポートしたデータから直接生成
    try {
      // ★エラーハンドリング追加
      const uniqueCategories1 = [...new Set(libraryData.map(item => item["カテゴリー1"]))];
      console.log("ライブラリ：useEffect - uniqueCategories1:", uniqueCategories1); // ★ログ追加: 生成されたカテゴリリスト確認
      setCategories1(uniqueCategories1);
      console.log("ライブラリ：useEffect - setCategories1 called"); // ★ログ追加: state更新関数呼び出し確認
    } catch (error) {
      console.error("ライブラリ：useEffect - Error generating categories1:", error); // ★ログ追加: カテゴリ生成エラー
    }
    console.log("ライブラリ：useEffect - end"); // ★ログ追加: useEffect 終了
  }, []); // 空の依存配列で初回マウント時のみ実行

  // カテゴリ1が変更されたときのハンドラ
  const onChangeCategory1 = event => {
    const selectedCategory1 = event.target.value;
    console.log("ライブラリ：onChangeCategory1 - selected:", selectedCategory1); // ★ログ追加
    setCategory1(selectedCategory1);
    setCategory2("default");

    if (selectedCategory1 === "default") {
      setCategories2([]);
      console.log("ライブラリ：onChangeCategory1 - reset categories2"); // ★ログ追加
    } else {
      try {
        // ★エラーハンドリング追加
        const uniqueCategories2 = [
          ...new Set(
            libraryData // インポートしたデータを使用
              .filter(item => item["カテゴリー1"] === selectedCategory1)
              .map(item => item["カテゴリー2"])
          )
        ];
        console.log("ライブラリ：onChangeCategory1 - uniqueCategories2:", uniqueCategories2); // ★ログ追加
        setCategories2(uniqueCategories2);
        console.log("ライブラリ：onChangeCategory1 - setCategories2 called"); // ★ログ追加
      } catch (error) {
        console.error("ライブラリ：onChangeCategory1 - Error generating categories2:", error); // ★ログ追加
      }
    }
  };

  // カテゴリ2が変更されたときのハンドラ
  const onChangeCategory2 = event => {
    const selectedCategory2 = event.target.value;
    console.log("ライブラリ：onChangeCategory2 - selected:", selectedCategory2); // ★ログ追加
    setCategory2(selectedCategory2);
  };

  if (!localStorage.getItem("progressScore")) {
    localStorage.setItem("progressScore", 0);
    const list = [];
    localStorage.setItem("checkedQuestion", JSON.stringify(list));
  }

  const Document = ({ title, text, img, tag, id, category1, category2 }) => {
    if (searchWord.length <= 0 && searchTag.length <= 0 && searchCategory1 === "default") return null;

    if (searchWord.length > 0) {
      if (title.indexOf(searchWord) === -1 && text.indexOf(searchWord) === -1) return null;
    }
    if (searchTag.length > 0) {
      if (tag.indexOf(searchTag) === -1) return null;
    }
    if (searchCategory1 !== "default") {
      if (category1 !== searchCategory1) return null;
      if (searchCategory2 !== "default" && category2 !== searchCategory2) return null;
    }

    return (
      <div
        onClick={e => {
          e.preventDefault();
          scene.emit("add_media", img);
          if (!sessionStorage.getItem("objectTutorial")) {
            sessionStorage.setItem("objectTutorial", true);
            alert(
              "オブジェクトは右クリックで詳細を確認することができます。リンクを取得したり、理解度チェックを受けてみてください。"
            );
          }
          setQuestion(id);
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px 20px",
          boxShadow: "2px 2px 4px #dfdfdf",
          borderRadius: "10px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            height: "100%",
            width: "120px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: "0"
          }}
        >
          <img
            src={img}
            alt={title}
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover"
            }}
          />
        </div>
        <div style={{ overflow: "hidden" }}>
          <h4>{title}</h4>
          <br />
          <p style={{ overflowY: "auto" }} className={styles.hiddenScrollBar}>
            {text}
          </p>
          <br />
          <div
            style={{
              textAlign: "right",
              color: "#ffffff",
              borderRadius: "15px",
              backgroundColor: "#007ab8",
              display: "inline-block",
              padding: "6px 12px",
              fontSize: "10px",
              cursor: "pointer"
            }}
            onClick={e => onClickTags(e)}
          >
            {tag}
          </div>
        </div>
      </div>
    );
  };

  const searchDocuments = event => {
    if (event.target.value.indexOf("タグ検索：") !== -1) {
      setWord("");
    } else {
      setWord(event.target.value);
      setTag("");
    }
  };

  const onClickTags = tag => {
    if (ref.current) {
      ref.current.value = "タグ検索：" + tag.target.innerText;
    }
    setTag(tag.target.innerText);
    setWord("");
  };

  return (
    <Sidebar title="ライブラリ" beforeTitle={<CloseButton onClick={onClose} />} disableOverflowScroll>
      {/* ★ログ追加: レンダリング時の state 確認 */}
      {console.log("ライブラリ：Rendering - categories1 state:", categories1)}
      {console.log("ライブラリ：Rendering - categories2 state:", categories2)}
      {console.log("ライブラリ：Rendering - libraryDataState length:", libraryDataState.length)}{" "}
      {/* データ件数もログ */}
      {console.log("ライブラリ：Rendering - searchCategory1:", searchCategory1)}
      {console.log("ライブラリ：Rendering - searchCategory2:", searchCategory2)}
      <div
        style={{
          padding: "8px 16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <h3
          style={{
            textAlign: "right",
            margin: "16px 0",
            color: "#ffffff",
            borderRadius: "10px",
            backgroundColor: "#007ab8",
            display: "inline-block",
            padding: "8px 16px"
          }}
        >
          学習の進捗ポイント: {localStorage.getItem("progressScore")} pt
        </h3>
        <TextAreaInput
          ref={ref}
          textInputStyles={styles.libraryInputTextAreaStyles}
          placeholder="資料をキーワードやタグで検索する"
          onChange={e => searchDocuments(e)}
        />
        <select
          name="category1"
          value={searchCategory1}
          onChange={onChangeCategory1}
          className={styles.categorySelecter}
        >
          <option value="default">カテゴリ1を選択</option>
          {/* categories1 state を使用 (useEffectで設定される) */}
          {categories1.map((cat1, index) => {
            // ★ログ追加: mapループ内の確認
            console.log(`ライブラリ：Rendering category1 map - index: ${index}, value: ${cat1}`);
            return (
              <option key={index} value={cat1}>
                {cat1}
              </option>
            );
          })}
        </select>
        {/* カテゴリ1が選択されている場合のみカテゴリ2の選択肢を表示 */}
        {searchCategory1 !== "default" && categories2.length > 0 && (
          <select
            name="category2"
            value={searchCategory2}
            onChange={onChangeCategory2}
            className={styles.categorySelecter}
            style={{ marginTop: "8px" }}
          >
            <option value="default">カテゴリ2を選択 (全て)</option>
            {/* categories2 state を使用 (onChangeCategory1で設定される) */}
            {categories2.map((cat2, index) => {
              // ★ログ追加: mapループ内の確認 (カテゴリ2)
              console.log(`ライブラリ：Rendering category2 map - index: ${index}, value: ${cat2}`);
              return (
                <option key={index} value={cat2}>
                  {cat2}
                </option>
              );
            })}
          </select>
        )}
        <div
          style={{
            marginTop: searchCategory1 !== "default" && categories2.length > 0 ? "8px" : "16px",
            overflowY: "auto",
            height: `calc(100% - ${160 + (searchCategory1 !== "default" && categories2.length > 0 ? 40 : 0)}px)`,
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px 0"
          }}
          className={styles.hiddenScrollBar}
        >
          {/* Documentリスト */}
          {libraryDataState.length > 0 ? (
            libraryDataState.map((item, index) => (
              <Document
                key={index}
                title={item["タイトル"]}
                text={item["説明文"]}
                img={item["記事/動画・音声"] === "記事" ? Article : Video}
                tag={item["検索用キーワード"]}
                id={index}
                category1={item["カテゴリー1"]}
                category2={item["カテゴリー2"]}
              />
            ))
          ) : (
            <p>表示できる資料がありません。</p>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
