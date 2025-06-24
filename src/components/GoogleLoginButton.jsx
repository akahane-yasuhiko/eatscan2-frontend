import { useEffect } from "react";

export default function GoogleLoginButton({ onLogin }) {
  useEffect(() => {
    // すでにロードされていれば即 initialize、されてなければ少し待つ
    const intervalId = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        clearInterval(intervalId);

        window.google.accounts.id.initialize({
          client_id: "383294436446-pbu6ec1tdacltftdnbjfm8sg5smsch1f.apps.googleusercontent.com",
          callback: (response) => {
            const idToken = response.credential;
            onLogin(idToken);
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login"),
          { theme: "outline", size: "large" }
        );
      }
    }, 100);

    return () => clearInterval(intervalId); // コンポーネントアンマウント時にクリーンアップ
  }, []);

  return <div id="google-login"></div>;
}
