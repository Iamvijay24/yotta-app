import { CognitoUserPool } from 'amazon-cognito-identity-js';

const awsConfig = {
  region: 'us-west-2',
  UserPoolId: 'us-west-2_2bjZilvYy',
  ClientId: '53afdhv2c580os0onlnvlemgeu',
};

export default new CognitoUserPool(awsConfig);
