export const putToLambda = (tableName, item) => {
  const url =
    'https://o6bicnxurggu6stg4gnyotmuyu0mbahl.lambda-url.ap-northeast-1.on.aws/';

  const body = JSON.stringify({
    tableName: tableName,
    item: item,
  });

  const options = {
    method: 'POST',
    body: body,
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export const getFromLambda = async (tableName, key, keyValue) => {
  const body = JSON.stringify({
    table: tableName, // DynamoDBのテーブル名
    [key]: keyValue, // キー
  });

  const response = await fetch(
    'https://quykacixacd762ewgdbfodxi6u0hiclx.lambda-url.ap-northeast-1.on.aws/', // 関数URL
    {
      body: body,
      method: 'POST',
    }
  )
    .then((response) => response.json()) // レスポンスをJSONとして解析
    .then((data) => {
      console.log('Success:', data.Item);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return response;
};

export const updateToLambda = (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
  expressionAttributeNames
) => {
  const url =
    'https://cnfmmzxlnlgdra2e3yumvzmclq0ctiok.lambda-url.ap-northeast-1.on.aws/'; // API GatewayのエンドポイントURLを指定してください

  const body = JSON.stringify({
    tableName,
    key,
    updateExpression,
    expressionAttributeValues,
    expressionAttributeNames,
  });

  const options = {
    method: 'POST', // API GatewayがLambda関数を呼び出すためのHTTPメソッド
    body,
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

/*
getFromLambda('generalParameter', 'key', 'settings');
putToLambda('userList', {
              ID: '001',
              name: 'John Doe',
              age: 25,
              sex: 'male',
            })
updateToLambda(
              'userList',
              { ID: '001' },
              'set #name = :name',
              {
                ':name': 'John Doe Updated',
              },
              {
                '#name': 'name', // この行を追加
              }
            );
*/