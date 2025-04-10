import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
// import libraryDataCsvPath from '../../assets/libraryData/libraryData.csv'; // CSVインポート削除
// console.log('Imported CSV Path:', libraryDataCsvPath); // CSVログ削除
import libraryData from "../../assets/libraryData/libraryData.json"; // JSONファイルをインポート

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
  const [libraryData, setLibraryData] = useState([]);
  const [categories1, setCategories1] = useState([]);
  const [categories2, setCategories2] = useState([]);

  // CSVをパースするヘルパー関数 parseCSV は不要になったので削除
  // const parseCSV = (csvText) => { ... };

  // コンポーネントマウント時にCSVを読み込む useEffect を修正
  useEffect(() => {
    // fetch('/libraryData.csv') ... catch(...) // fetch処理全体を削除

    // インポートしたJSONデータを直接セット
    setLibraryData(libraryData);

    // カテゴリ1のリストを生成 (重複排除) - インポートしたデータから直接生成
    const uniqueCategories1 = [...new Set(libraryData.map(item => item["カテゴリー1"]))];
    setCategories1(uniqueCategories1);
  }, []); // 空の依存配列で初回マウント時のみ実行

  // カテゴリ1が変更されたときのハンドラ (libraryData を直接参照するように)
  const onChangeCategory1 = event => {
    const selectedCategory1 = event.target.value;
    setCategory1(selectedCategory1);
    setCategory2("default");

    if (selectedCategory1 === "default") {
      setCategories2([]);
    } else {
      // 選択されたカテゴリ1に属するカテゴリ2のリストを生成 (重複排除)
      const uniqueCategories2 = [
        ...new Set(
          libraryData // stateではなく直接インポートしたデータを使用
            .filter(item => item["カテゴリー1"] === selectedCategory1)
            .map(item => item["カテゴリー2"])
        )
      ];
      setCategories2(uniqueCategories2);
    }
  };

  // カテゴリ2が変更されたときのハンドラは変更なし
  const onChangeCategory2 = event => {
    setCategory2(event.target.value);
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
          {categories1.map((cat1, index) => (
            <option key={index} value={cat1}>
              {cat1}
            </option>
          ))}
        </select>
        {searchCategory1 !== "default" && categories2.length > 0 && (
          <select
            name="category2"
            value={searchCategory2}
            onChange={onChangeCategory2}
            className={styles.categorySelecter}
            style={{ marginTop: "8px" }}
          >
            <option value="default">カテゴリ2を選択 (全て)</option>
            {categories2.map((cat2, index) => (
              <option key={index} value={cat2}>
                {cat2}
              </option>
            ))}
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
          {libraryData.length > 0 ? (
            libraryData.map((item, index) => (
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
