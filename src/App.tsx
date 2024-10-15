import { useState } from "react";
import * as Auth from "aws-amplify/auth";

// ランダムにパスワードを生成
const randomPass = () => {
  // 使用する英数字を変数charに指定
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  // 空文字列を用意
  let randomStr = "";

  // 用意した空文字列にランダムな英数字を格納（7桁）
  for (let i = 0; i < 8; i++) {
    while (true) {
      // ランダムな英数字を一文字生成
      const random = chars.charAt(Math.floor(Math.random() * chars.length));

      // randomStrに生成されたランダムな英数字が含まれるかチェック
      if (!randomStr.includes(random)) {
        // 含まれないなら、randomStrにそれを追加してループを抜ける
        randomStr += random;
        break;
      }
    }
  }

  return randomStr;
};

const JAPAN_PHONE_COUNTRY_CODE = "+81";
const PASSWORD = randomPass();
function App() {
  const [signUpPhoneNumber, setSignUpPhoneNumber] = useState("");
  const [confirmSignUpCode, setConfirmSignUpCode] = useState("");

  const [signInPhoneNumber, setSignInPhoneNumber] = useState("");
  const [cognitoUser, setCognitoUser] = useState<Auth.SignInOutput | null>(
    null
  );
  const [confirmSignInCode, setConfirmSignInCode] = useState("");

  const signUp = async () => {
    console.log(PASSWORD);
    try {
      const user = await Auth.signUp({
        username: JAPAN_PHONE_COUNTRY_CODE + signUpPhoneNumber,
        password: PASSWORD,
      });
      console.log("仮登録をしました。user:", { user });
    } catch (error) {
      console.log("error signing up:", { error });
    }
  };

  const confirmSignUp = async () => {
    try {
      await Auth.confirmSignUp({
        username: JAPAN_PHONE_COUNTRY_CODE + signUpPhoneNumber,
        confirmationCode: confirmSignUpCode,
      });
      alert("登録完了しました。");
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  };

  const signIn = async () => {
    try {
      console.log("Signing in...");
      const user = await Auth.signIn({
        username: JAPAN_PHONE_COUNTRY_CODE + signInPhoneNumber,
        options: {
          authFlowType: "CUSTOM_WITHOUT_SRP",
        },
      });
      setCognitoUser(user);
    } catch (error) {
      console.log("error sign in", error);
    }
  };

  const signInChallenge = async () => {
    if (!cognitoUser) {
      return;
    }
    try {
      const loggedUser = await Auth.confirmSignIn({
        challengeResponse: confirmSignInCode,
      });
      console.log(loggedUser);
      alert("ログインしました。");
    } catch (error) {
      console.log("error confirming sign in", error);
    }
  };

  const logout = () => {
    console.log("ログアウト");
    return Auth.signOut();
  };

  return (
    <div>
      <div className="signUpSeriesContainer">
        <div className="signUpContainer">
          <input
            type="text"
            placeholder="signUpPhoneNumber"
            value={signUpPhoneNumber}
            onChange={(e) => setSignUpPhoneNumber(e.target.value)}
          />
          <button onClick={() => signUp()}>仮登録</button>
        </div>
        <div className="confirmSignUpContainer">
          <input
            type="text"
            placeholder="confirmSignUpCode"
            value={confirmSignUpCode}
            onChange={(e) => setConfirmSignUpCode(e.target.value)}
          />
          <button onClick={() => confirmSignUp()}>登録</button>
        </div>
      </div>
      <div className="signInSeriesContainer">
        <div className="signInContainer">
          <input
            type="text"
            placeholder="signInPhoneNumber"
            value={signInPhoneNumber}
            onChange={(e) => setSignInPhoneNumber(e.target.value)}
          />
          <button onClick={() => signIn()}>SMSを送る</button>
        </div>
        <div className="confirmSignUpContainer">
          <input
            type="text"
            placeholder="confirmSignInCode"
            value={confirmSignInCode}
            onChange={(e) => setConfirmSignInCode(e.target.value)}
          />
          <button onClick={() => signInChallenge()}>確認する</button>
        </div>
      </div>
      <div
        className="singOutContainer"
        onClick={() => {
          Auth.signOut();
        }}
      >
        <button onClick={() => logout()}>ログアウト</button>
      </div>
    </div>
  );
}

export default App;
