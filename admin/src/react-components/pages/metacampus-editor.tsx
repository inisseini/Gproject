import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import withCommonStyles from "../../utils/with-common-styles";
import "../../styles/globals.scss";
import Card from "../shared/Card";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const styles = withCommonStyles(() => ({}));

const metacampusSystemEditorComponent = ({ classes }) => {
  const DBClient = new DynamoDBClient({
    region: 'ap-northeast-1',
    credentials: {
      accessKeyId: 'AKIA6O7CLSZWBGWOEKTK',
      secretAccessKey: '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',
    },
  });

  const docClient = DynamoDBDocumentClient.from(DBClient);

  const [values, setValues] = useState({
    openingTime: 0,
    closingTime: 24,
  });

  useEffect(() => {
    const Get = async () => {
      const command = new GetCommand({
        TableName: 'generalParameter',
        Key: {
          key: 'settings',
        },
      });
  
      const response = await docClient.send(command);
      setValues({
        openingTime: response.Item.openingTime,
        closingTime: response.Item.closingTime,
      });
    };

    Get();
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const openingTime = event.target.openingTime.value;
    const closingTime = event.target.closingTime.value;

    const command = new UpdateCommand({
      TableName: 'generalParameter',
      Key: {
        key: 'settings',
      },
      ExpressionAttributeNames: {
        '#opening': 'openingTime',
        '#closing': 'closingTime',
      },
      ExpressionAttributeValues: {
        ':openingTime': openingTime,
        ':closingTime': closingTime,
      },
      UpdateExpression: 'SET #opening = :openingTime, #closing = :closingTime',
    });

    const response = await docClient.send(command);
  };

  return (
    <div className="page_wrapper">
      <Card>
        <div>
          <h2>MetaCampUs設定</h2>
          <form onSubmit={handleSubmit}>
        <label>
          開始時間:
          <input
            type='num'
            name='openingTime'
            defaultValue={values.openingTime}
            required
          />
        </label>
        <label>
          終了時間:
          <input
            type='num'
            name='closingTime'
            defaultValue={values.closingTime}
            required
          />
        </label>
        <input type='submit' value='Submit' />
      </form>
        </div>
      </Card>
    </div>
  );
};

export const metacampusSystemEditor = withStyles(styles)(metacampusSystemEditorComponent);
