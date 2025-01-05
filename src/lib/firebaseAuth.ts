import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';

const auth = getAuth();
const email = "belleyuri@gmail.com"; // 사용자의 이메일을 명시적으로 설정

const actionCodeSettings = {
  url: `https://www.example.com/?email=${email}`,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  handleCodeInApp: true,
  dynamicLinkDomain: "example.page.link"
};

sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    console.log('이메일 링크가 전송되었습니다.');
  })
  .catch((error) => {
    console.error('오류 발생:', error);
  });
