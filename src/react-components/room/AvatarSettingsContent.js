import React from "react";
import PropTypes from "prop-types";
import { Button, AcceptButton } from "../input/Button";
import styles from "./AvatarSettingsContent.scss";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

import userDemoImg from "../../assets/images/OOKAWA9V9A6918_TP_V4.jpg";

export function AvatarSettingsContent({
  displayName,
  pronouns,
  profile,
  friendContent,
  sendDiscordMessage,
  displayNameInputRef,
  pronounsInputRef,
  profileInputRef,
  friendContentInputRef,
  sendDiscordMessageInputRef,
  disableDisplayNameInput,
  onChangeDisplayName,
  onChangePronouns,
  onChangeProfile,
  onChangefriendContent,
  onChangeSendDiscordMessage,
  avatarPreview,
  displayNamePattern,
  pronounsPattern,
  profilePattern,
  friendContentPattern,
  sendDiscordMessagePattern,
  onChangeAvatar,
  ...rest
}) {
  console.log('avatarsettingscontent original');
  return (
    <Column as="form" className={styles.content} {...rest}>
      <div className={styles.icon}>
        <img src={userDemoImg} />
      </div>
      <button className={styles.iconButton}>アイコン変更</button>
      <TextInputField
        disabled={disableDisplayNameInput}
        label={<FormattedMessage id="avatar-settings-content.display-name-label" defaultMessage="Display Name" />}
        value={displayName}
        pattern={displayNamePattern}
        spellCheck="false"
        required
        onChange={onChangeDisplayName}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-name-description"
            defaultMessage="Alphanumerics, Japanese, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          />
        }
        ref={displayNameInputRef}
      />
      <TextInputField
        label={
          <><FormattedMessage id="avatar-settings-content.display-profile-label" defaultMessage="Profile (optional)" /><br/><p>全体に公開するプロフィールです。</p></>
        }
        value={profile}
        pattern={profilePattern}
        spellCheck="false"
        onChange={onChangeProfile}
        description={
          <><FormattedMessage
            id="avatar-settings-content.display-profile-description"
            defaultMessage="Alphanumerics, hyphens, underscores, and tildes. No more than 32"
          /><br/><p>フレンドにのみ公開するプロフィールです。本名や所属大学・組織を記入することを推奨します。</p></>
        }
        ref={profileInputRef}
      />
      <TextInputField
        label={
          <FormattedMessage id="avatar-settings-content.display-friendContent-label" defaultMessage="フレンド限定表示内容" />
        }
        value={friendContent}
        pattern={friendContentPattern}
        spellCheck="false"
        onChange={onChangefriendContent}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-friendContent-description"
            defaultMessage="フレンドにのみ表示される情報です"
          />
        }
        ref={friendContentInputRef}
      />
      <TextInputField
        label={
          <FormattedMessage
            id="avatar-settings-content.sendDiscordMessage-label"
            defaultMessage="入室時にDiscord通知を行う"
          />
        }
        value={sendDiscordMessage}
        pattern={sendDiscordMessagePattern}
        spellCheck="false"
        onChange={onChangeSendDiscordMessage}
        ref={sendDiscordMessageInputRef}
      />
      <TextInputField
        label={<FormattedMessage id="avatar-settings-content.pronouns-label" defaultMessage="Pronouns (optional)" />}
        value={pronouns}
        pattern={pronounsPattern}
        spellCheck="false"
        onChange={onChangePronouns}
        ref={pronounsInputRef}
      />
      <div className={styles.avatarPreviewContainer}>
        {avatarPreview || <div />}
        <Button type="button" preset="basic" onClick={onChangeAvatar}>
          <FormattedMessage id="avatar-settings-content.change-avatar-button" defaultMessage="Change Avatar" />
        </Button>
      </div>
      <AcceptButton preset="accept" type="submit" />
    </Column>
  );
}

AvatarSettingsContent.propTypes = {
  className: PropTypes.string,
  displayName: PropTypes.string,
  pronouns: PropTypes.string,
  profile: PropTypes.string,
  displayNameInputRef: PropTypes.func,
  pronounsInputRef: PropTypes.func,
  profileInputRef: PropTypes.func,
  disableDisplayNameInput: PropTypes.bool,
  displayNamePattern: PropTypes.string,
  pronounsPattern: PropTypes.string,
  profilePattern: PropTypes.string,
  friendContentPattern: PropTypes.string,
  onChangeDisplayName: PropTypes.func,
  onChangePronouns: PropTypes.func,
  onChangeProfile: PropTypes.func,
  avatarPreview: PropTypes.node,
  onChangeAvatar: PropTypes.func
};
