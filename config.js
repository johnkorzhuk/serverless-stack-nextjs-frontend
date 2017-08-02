export default {
  s3: {
    BUCKET: 'notes-app-api'
  },
  apiGateway: {
    URL: 'https://web9z5gmfa.execute-api.us-east-1.amazonaws.com/prod',
    REGION: 'us-east-1'
  },
  cognito: {
    USER_POOL_ID: 'us-east-1_28Kyoswud',
    APP_CLIENT_ID: '7trnopbcvdllaf5cpou5aaudvl',
    REGION: 'us-east-1',
    IDENTITY_POOL_ID: 'us-east-1:4d9196b1-9501-4bbd-9327-f9376805d818'
  },
  MAX_ATTACHMENT_SIZE: 5000000
};
