import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { ENV } from '../../config/env';

// const awsConfig = {
//   region: ENV.AWS_REGION,
//   UserPoolId: ENV.AWS_USER_POOL_ID,
//   ClientId: ENV.AWS_USER_POOL_CLIENT_ID,
// };

const awsConfig = {
  region: 'us-west-2',
  UserPoolId: 'us-west-2_2bjZilvYy',
  ClientId: '53afdhv2c580os0onlnvlemgeu',
};

export default new CognitoUserPool(awsConfig);
