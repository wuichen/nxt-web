export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: "notes-app-uploads"
  },
  apiGateway: {
    REGION: "ap-northeast-1",
    URL: ".execute-api.ap-northeast-1.amazonaws.com/v1"
  },
  cognito: {
    REGION: "ap-northeast-1",
    USER_POOL_ID: "ap-northeast-1_7U7LGfa7E",
    APP_CLIENT_ID: "vguqhcpustlri2c0arbnk0jta",
    IDENTITY_POOL_ID: "ap-northeast-1:41d28826-cb49-4d1f-8150-0270659b571e"
  }
};

const siteConfig = {
  siteName: 'ISOMORPHIC',
  siteIcon: 'ion-flash',
  footerText: 'Isomorphic ©2017 Created by RedQ, Inc',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';
export {
  siteConfig,
  language,
  themeConfig
};



