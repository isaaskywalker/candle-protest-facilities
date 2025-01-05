import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';

export const sendAuthLink = (email: string) => {
  const auth = getAuth();
  const actionCodeSettings = {
    url: 'https://your-app.com/finishSignUp',
    handleCodeInApp: true,
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
      alert('이메일로 인증 링크를 보냈습니다.');
    })
    .catch((error) => {
      console.error('인증 링크 전송 오류:', error);
    });
};
