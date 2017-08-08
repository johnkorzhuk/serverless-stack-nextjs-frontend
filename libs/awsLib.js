// @flow
import AWS from 'aws-sdk';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

import sigV4Client from './sigV4Client';

import config from '../config';

function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
}

export function getUserToken() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export function getAwsCredentials(userToken: string): ?Promise<*> {
  if (AWS.config.credentials && Date.now() < AWS.config.credentials.expireTime - 60000) {
    return;
  }

  const authenticator = `cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  // eslint-disable-next-line consistent-return
  return AWS.config.credentials.getPromise();
}

type Params = {
  path: string,
  method?: string,
  headers?: Object,
  queryParams?: Object,
  body?: Object | string
};

export async function invokeApig(
  { path, method = 'GET', headers = {}, queryParams = {}, body }: Params,
  userToken: string
) {
  // console.log({ userToken });
  await getAwsCredentials(userToken);

  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: config.apiGateway.REGION,
      endpoint: config.apiGateway.URL
    })
    .signRequest({
      method,
      path,
      headers,
      queryParams,
      body
    });

  // eslint-disable-next-line no-param-reassign
  body = body ? JSON.stringify(body) : body;
  // eslint-disable-next-line no-param-reassign
  headers = signedRequest.headers;
  const results = await fetch(signedRequest.url, {
    method,
    headers,
    body
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}

export async function s3Upload(file: File, userToken: string): Promise<*> {
  await getAwsCredentials(userToken);

  const s3 = new AWS.S3({
    params: {
      Bucket: config.s3.BUCKET
    }
  });
  const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;

  return s3
    .upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    })
    .promise();
}

export function login(username: string, password: string) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  const authenticationData = {
    Username: username,
    Password: password
  };

  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(result.getIdToken().getJwtToken()),
      onFailure: err => reject(err)
    })
  );
}

export function logout() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId();
  }
}
