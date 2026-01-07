import { CognitoUserPool } from "amazon-cognito-identity-js";
const awsConfig = {
  region: "us-west-2",
  UserPoolId: "us-west-2_2bjZilvYy",
  ClientId: "53afdhv2c580os0onlnvlemgeu",
  // redirect_uri: "https://d84l1y8p4kdic.cloudfront.net",
  cookieStorage: {
    domain: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    path: "/",
    expires: 365,
    sameSite: "strict",
    secure: window.location.protocol === 'https:',
  },
  oauth: {
    domain: "https://videoassistant.auth.us-east-1.amazoncognito.com",
    scope: "phone openid email",
    redirectSignIn: "http://localhost:3000/",
    redirectSignOut: "http://localhost:3000/",
    responseType: "code",
  },
};

export default new CognitoUserPool(awsConfig);
