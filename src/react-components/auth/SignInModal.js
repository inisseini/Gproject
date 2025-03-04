import React, { useCallback, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { CloseButton } from "../input/CloseButton";
import { Modal } from "../modal/Modal";
import { FormattedMessage, useIntl, defineMessages } from "react-intl";
import { CancelButton, NextButton, ContinueButton } from "../input/Button";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { LegalMessage } from "./LegalMessage";
import { putToLambda } from "../../utils/aws-lambda-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

export const SignInStep = {
  submit: "submit",
  waitForVerification: "waitForVerification",
  complete: "complete"
};

export const SignInMessages = defineMessages({
  pin: {
    id: "sign-in-modal.signin-message.pin",
    defaultMessage: "You'll need to sign in to pin objects."
  },
  unpin: {
    id: "sign-in-modal.signin-message.unpin",
    defaultMessage: "You'll need to sign in to un-pin objects."
  },
  changeScene: {
    id: "sign-in-modal.signin-message.change-scene",
    defaultMessage: "You'll need to sign in to change the scene."
  },
  roomSettings: {
    id: "sign-in-modal.signin-message.room-settings",
    defaultMessage: "You'll need to sign in to change the room's settings."
  },
  closeRoom: {
    id: "sign-in-modal.signin-message.close-room",
    defaultMessage: "You'll need to sign in to close the room."
  },
  muteUser: {
    id: "sign-in-modal.signin-message.mute-user",
    defaultMessage: "You'll need to sign in to mute other users."
  },
  kickUser: {
    id: "sign-in-modal.signin-message.kick-user",
    defaultMessage: "You'll need to sign in to kick other users."
  },
  addOwner: {
    id: "sign-in-modal.signin-message.add-owner",
    defaultMessage: "You'll need to sign in to assign moderators."
  },
  removeOwner: {
    id: "sign-in-modal.signin-message.remove-owner",
    defaultMessage: "You'll need to sign in to assign moderators."
  },
  createAvatar: {
    id: "sign-in-modal.signin-message.create-avatar",
    defaultMessage: "You'll need to sign in to create avatars."
  },
  remixAvatar: {
    id: "sign-in-modal.signin-message.remix-avatar",
    defaultMessage: "You'll need to sign in to remix avatars."
  },
  remixScene: {
    id: "sign-in-modal.signin-message.remix-scene",
    defaultMessage: "You'll need to sign in to remix scenes."
  },
  favoriteRoom: {
    id: "sign-in-modal.signin-message.favorite-room",
    defaultMessage: "You'll need to sign in to add this room to your favorites."
  },
  favoriteRooms: {
    id: "sign-in-modal.signin-message.favorite-rooms",
    defaultMessage: "You'll need to sign in to add favorite rooms."
  },
  tweet: {
    id: "sign-in-modal.signin-message.tweet",
    defaultMessage: "You'll need to sign in to send tweets."
  }
});

export function SubmitEmail({ onSubmitEmail, initialEmail, privacyUrl, termsUrl, message }) {
  const DBClient = new DynamoDBClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: "AKIA6O7CLSZWBGWOEKTK",
      secretAccessKey: "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"
    }
  });

  const docClient = DynamoDBDocumentClient.from(DBClient);

  {
    /* 
  const [list, setList] = useState("");

  const GetGeneral = async () => {
    const command = new GetCommand({
      TableName: "generalParameter",
      Key: {
        key: "accountPermission"
      }
    });

    const response = await docClient.send(command);

    console.log(response.Item);

    const storedPattern = response.Item.mailList;

    // スラッシュを削除
    const cleanedPattern = storedPattern.replace(/^\/|\/$/g, "");

    // 正規表現オブジェクトに変換
    const regex = new RegExp(cleanedPattern);

    setList(regex);
    console.log("test=", list.test("waseda.jp"));
  };

  GetGeneral();
  */
  }

  const intl = useIntl();

  const [email, setEmail] = useState(initialEmail);

  const mailList =
    /waseda.jp|w-as.jp|u-tokyo.ac.jp|sangaku.titech.ac.jp|titech.ac.jp|tuat.ac.jp|ocha.ac.jp|kuhs.ac.jp|ynu.ac.jp|yokohama-cu.ac.jp|tmd.ac.jp|keio.ac.jp|tmu.ac.jp|keio.jp|shibaura-it.ac.jp|ow.shibaura-it.ac.jp|s.tsukuba.ac.jp|u.tsukuba.ac.jp|sic.shibaura-it.ac.jp|wasedajg.ed.jp|wasedasaga.jp|chiba-u.jp|student.chiba-u.jp|faculty.chiba-u.jp|student.gs.chiba-u.jp|office.gs.chiba-u.jp|faculty.gs.chiba-u.jp|ac.jp|vleap.jp/;

  const generateRandomID = () => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const onSubmitForm = useCallback(
    isUser => {
      console.log(isUser);

      if (!mailList.test(email) && !isUser) {
        //e.preventDefault();
        alert("無効なメールアドレスです。");
        return;
      } else if (mailList.test(email) || isUser) {
        //e.preventDefault();

        const handlePut = async () => {
          const type = "PUT";
          const data = `type=${type}&email=${email}&isAdmin=${false}&isTeacher=${false}&requested=${"[]"}&friends=${"[]"}`;
          try {
            const res = await axios.post(
              "https://xt6bz2ybhi3tj3eu3djuuk7lzy0eabno.lambda-url.ap-northeast-1.on.aws/",
              data,
              {
                headers: {
                  "Content-Type": "text/plain"
                }
              }
            );
            console.log("アカウント情報更新");
            localStorage.setItem("myID", res.data.message);
            return res.data.message;
          } catch (error) {
            console.error("Error putting data:", error);
          }
        };

        const checkId = async () => {
          console.log("checkID");
          const type = "GET";
          const data = `type=${type}&email=${email}`;
          try {
            const res = await axios.post(
              "https://xt6bz2ybhi3tj3eu3djuuk7lzy0eabno.lambda-url.ap-northeast-1.on.aws/",
              data,
              {
                headers: {
                  "Content-Type": "text/plain"
                }
              }
            );
            // アカウントが存在しない場合
            if (res.data.Item === undefined) {
              console.log("アカウントを作成します");
              handlePut();
              //putToLambda("userList", { ID: newID, requested: [], friends: [], isAdmin: false, isTeacer: false });
            } else if (res.data.Item.ID !== localStorage.getItem("myID")) {
              console.log("アカウントが変更されました");
              localStorage.setItem("myID", res.data.Item.ID);
              localStorage.setItem("myFriends", JSON.stringify(res.data.Item.friends));
            }
          } catch (error) {
            console.error("Error getting data:", error);
          }
        };

        checkId();

        const myFriends = localStorage.getItem("myFriends");
        if (!myFriends) {
          localStorage.setItem("myFriends", JSON.stringify([]));
        }

        const discordPermission = localStorage.getItem("discordPermission");

        if (!discordPermission) {
          // 生成したIDをlocalStorageに保存
          localStorage.setItem("discordPermission", "希望しない");
        }

        onSubmitEmail(email);
      }
    },
    [onSubmitEmail, email]
  );

  const checkEmail = e => {
    console.log("checkemail");
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    const lambdaUrl = "https://ngocrussbibfjkxpp6avz2buta0ookyu.lambda-url.ap-northeast-1.on.aws/";
    xhr.open("POST", lambdaUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Lambda に送るリクエストデータ
    const request = JSON.stringify({ email: email });

    // レスポンスを受け取った後の処理
    xhr.onreadystatechange = () => {
      console.log("aa");

      if (xhr.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(xhr.responseText);
        console.log(response.exists);
        onSubmitForm(response.exists);
      }
    };

    xhr.send(request);
  };

  const onChangeEmail = useCallback(
    e => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  return (
    <Column center padding as="form" onSubmit={e => checkEmail(e)}>
      <p>
        {message ? (
          intl.formatMessage(message)
        ) : (
          <FormattedMessage id="sign-in-modal.prompt" defaultMessage="Please Sign In" />
        )}
      </p>
      <TextInputField
        name="email"
        type="email"
        required
        value={email}
        onChange={onChangeEmail}
        placeholder="example@example.com"
      />
      <p>
        <small>
          <LegalMessage termsUrl={termsUrl} privacyUrl={privacyUrl} />
        </small>
      </p>
      <NextButton type="submit" />
    </Column>
  );
}

SubmitEmail.defaultProps = {
  initialEmail: ""
};

SubmitEmail.propTypes = {
  message: PropTypes.object,
  termsUrl: PropTypes.string,
  privacyUrl: PropTypes.string,
  initialEmail: PropTypes.string,
  onSubmitEmail: PropTypes.func.isRequired
};

export function WaitForVerification({ email, onCancel, showNewsletterSignup }) {
  return (
    <Column center padding>
      <FormattedMessage
        id="sign-in-modal.wait-for-verification"
        defaultMessage="<p>Email sent to {email}!</p><p>To continue, click on the link in the email using your phone, tablet, or PC.</p><p>No email? You may not be able to create an account.</p>"
        // eslint-disable-next-line react/display-name
        values={{ email, p: chunks => <p>{chunks}</p> }}
      />
      {showNewsletterSignup && (
        <p>
          <small>
            <FormattedMessage
              id="sign-in-modal.newsletter-signup-question"
              defaultMessage="Want Hubs news sent to your inbox?"
            />
            <br />
            <a href="https://eepurl.com/gX_fH9" target="_blank" rel="noopener noreferrer">
              <FormattedMessage id="sign-in-modal.newsletter-signup-link" defaultMessage="Subscribe for updates" />
            </a>
          </small>
        </p>
      )}
      <CancelButton onClick={onCancel} />
    </Column>
  );
}

WaitForVerification.propTypes = {
  showNewsletterSignup: PropTypes.bool,
  email: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired
};

export function SignInComplete({ message, onContinue }) {
  const intl = useIntl();

  return (
    <Column center padding>
      <p>
        <b>
          {message ? (
            intl.formatMessage(message)
          ) : (
            <FormattedMessage id="sign-in-modal.complete" defaultMessage="You are now signed in." />
          )}
        </b>
      </p>
      <ContinueButton onClick={onContinue} />
    </Column>
  );
}

SignInComplete.propTypes = {
  message: PropTypes.string,
  onContinue: PropTypes.func.isRequired
};

export function SignInModal({ closeable, onClose, children, ...rest }) {
  return (
    <Modal
      title={<FormattedMessage id="sign-in-modal.title" defaultMessage="Sign In" />}
      beforeTitle={closeable && <CloseButton onClick={onClose} />}
      {...rest}
    >
      {children}
    </Modal>
  );
}

SignInModal.propTypes = {
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
};
