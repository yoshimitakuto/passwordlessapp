// import { useState } from "react";
// import "./App.css";
// import { Amplify } from "aws-amplify";
// import * as Auth from "aws-amplify/auth";
// import config from "./aws-exports";

// Amplify.configure(config);

// const JAPAN_PHONE_COUNTRY_CODE = "+81";

// function App() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [cognitoUser, setCognitoUser] = useState<Auth.SignInOutput | null>(
//     null
//   );
//   const [text, setText] = useState("");

//   const signUp = async () => {
//     try {
//       // 電話番号でのサインアップ（パスワードなし）
//       await Auth.signUp({
//         username: phoneNumber,
//         password: "DummyPassword1!", // Cognitoはパスワードを必須とするが、実際には使用しない
//       });
//       setText("認証用コードを送信しました。 " + phoneNumber);
//     } catch (error: any) {
//       console.log("Error signing up:", error);
//       setText("Error signing up: " + error.message);
//     }
//   };
//   const confirmSignUp = async () => {
//     try {
//       await Auth.confirmSignUp({
//         username: JAPAN_PHONE_COUNTRY_CODE + phoneNumber,
//         confirmationCode: verificationCode,
//       });
//       alert("登録完了しました。");
//     } catch (error) {
//       console.log("error confirming sign up", error);
//     }
//   };

//   const signIn = async () => {
//     try {
//       // 電話番号でのサインイン
//       const user = await Auth.signIn({
//         username: phoneNumber,
//       });
//       setCognitoUser(user);
//       console.log("challenge", user);
//       console.log("認証コードを送信しました");
//     } catch (error: any) {
//       console.log("Error signing in:", error);
//       setText("Error signing in: " + error.message);
//     }
//   };

//   const signInChallenge = async () => {
//     if (!cognitoUser) {
//       return;
//     }
//     try {
//       const loggedUser = await Auth.confirmSignIn({
//         challengeResponse: verificationCode,
//       });
//       console.log(loggedUser);
//       alert("ログインしました。");
//     } catch (error) {
//       console.log("error confirming sign in", error);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await Auth.signOut();
//       console.log("ログアウトしました");
//       setText("ログアウトしました");
//     } catch (error: any) {
//       console.log("Error logging out:", error);
//       setText("Error logging out: " + error.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <div>
//         Phone Number :{" "}
//         <input
//           type="text"
//           placeholder="+1234567890"
//           onChange={(e) => setPhoneNumber(e.target.value)}
//         />
//       </div>
//       <div>
//         Verification Code :{" "}
//         <input
//           type="text"
//           placeholder="Verification Code"
//           onChange={(e) => setVerificationCode(e.target.value)}
//         />
//       </div>
//       <div>
//         <button onClick={signUp}>仮登録</button>
//         <button onClick={confirmSignUp}>本登録</button>
//         <button onClick={signIn}>SMSを送る</button>
//         <button onClick={signInChallenge}>ログイン</button>
//         <button onClick={signOut}>ログアウト</button>
//       </div>
//       <div>{text}</div>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import * as Auth from "aws-amplify/auth";

const JAPAN_PHONE_COUNTRY_CODE = "+81";
const PASSWORD = "e2D3ZfMT";
function App() {
  const [signUpPhoneNumber, setSignUpPhoneNumber] = useState("");
  const [confirmSignUpCode, setConfirmSignUpCode] = useState("");

  const [signInPhoneNumber, setSignInPhoneNumber] = useState("");
  const [cognitoUser, setCognitoUser] = useState<Auth.SignInOutput | null>(
    null
  );
  const [confirmSignInCode, setConfirmSignInCode] = useState("");

  const signUp = async () => {
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

  async function signIn() {
    try {
      const user = await Auth.signIn({
        username: JAPAN_PHONE_COUNTRY_CODE + signInPhoneNumber,
        password: PASSWORD,
      });
      setCognitoUser(user);
    } catch (error) {
      console.log("error sign in", error);
    }
  }

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

// import {
//   usePasswordless,
//   useLocalUserCache,
//   useAwaitableState,
// } from "amazon-cognito-passwordless-auth/react";
// import { useEffect, useState } from "react";

// function App() {
//   const {
//     signInStatus,
//     tokensParsed,
//     authenticateWithFido2,
//     stepUpAuthenticationWithSmsOtp,
//     busy,
//     fido2Credentials,
//   } = usePasswordless();
//   const { currentUser } = useLocalUserCache();
//   const [consentId, setConsentId] = useState<string>("");
//   const [lastError, setLastError] = useState<Error>();
//   const [stepUpAuthIdToken, setStepUpAuthIdToken] = useState("");
//   const [smsOtpPhoneNumber, setSmsOtpPhoneNumber] = useState("");
//   const [isWrongSmsOtp, setIsWrongSmsOtp] = useState<boolean>(false);
//   const showSmsOtpInput = !!smsOtpPhoneNumber;
//   const [smsOtp, setSmsOtp] = useState("");
//   const {
//     awaitable: awaitableSmsOtp,
//     resolve: resolveSmsOtp,
//     awaited: awaitedSmsOtp,
//     reject: cancelWaitingForSmsOtp,
//   } = useAwaitableState(smsOtp);

//   function handleStepUpAuthentication(
//     stepUpAuthFn: () => Promise<{ idToken: string }>
//   ) {
//     setLastError(undefined);
//     setStepUpAuthIdToken("");
//     stepUpAuthFn()
//       .then(({ idToken }) => setStepUpAuthIdToken(idToken))
//       .catch(setLastError);
//   }

//   useEffect(() => {
//     if (signInStatus !== "SIGNED_IN") {
//       setLastError(undefined);
//       setConsentId("");
//       setSmsOtpPhoneNumber("");
//       setIsWrongSmsOtp(false);
//       setStepUpAuthIdToken("");
//     }
//   }, [signInStatus]);

//   if (!tokensParsed) return null;

//   return (
//     <div className="step-up-auth-main">
//       <div className="step-up-auth-container">
//         <div className="step-up-auth-title">Step up Authentication</div>
//         <div>
//           Enter a Consent ID. You can make one up,
//           <br /> but let's pretend there's a transaction backend that generated
//           it.
//           <br /> (Also see:{" "}
//           <a
//             href="https://github.com/aws-samples/amazon-cognito-passwordless-auth/blob/main/SMS-OTP-STEPUP.md#step-up-authentication-with-sms-one-time-password"
//             target="_blank"
//             rel="noreferrer"
//           >
//             explanation of the step up procedure
//           </a>
//           )
//         </div>
//         <input
//           type={"text"}
//           placeholder={"Consent ID"}
//           value={consentId}
//           onChange={(e) => setConsentId(e.target.value)}
//           disabled={busy}
//           autoFocus
//         ></input>
//         <div>Next, initiate Step Up authentication. Choose either method:</div>
//         <div className="step-up-auth-buttons">
//           <button
//             title={
//               !fido2Credentials?.length
//                 ? "To use WebAuthn, first add face or touch unlock"
//                 : undefined
//             }
//             disabled={!fido2Credentials?.length || !consentId || busy}
//             onClick={() =>
//               handleStepUpAuthentication(
//                 () =>
//                   authenticateWithFido2({
//                     username: tokensParsed.idToken["cognito:username"],
//                     credentials: currentUser?.credentials,
//                     clientMetadata: { consent_id: consentId },
//                   }).signedIn
//               )
//             }
//           >
//             WebAuthn
//           </button>
//           <button
//             disabled={!consentId || busy}
//             onClick={() => {
//               setIsWrongSmsOtp(false);
//               handleStepUpAuthentication(() =>
//                 stepUpAuthenticationWithSmsOtp({
//                   username: tokensParsed.idToken["cognito:username"],
//                   smsMfaCode: (phoneNumber: string, attempt: number) => {
//                     setSmsOtpPhoneNumber(phoneNumber);
//                     setIsWrongSmsOtp(attempt > 1);
//                     return awaitableSmsOtp();
//                   },
//                   clientMetadata: { consent_id: consentId },
//                 }).signedIn.finally(() => {
//                   setSmsOtp("");
//                   setSmsOtpPhoneNumber("");
//                 })
//               );
//             }}
//           >
//             SMS OTP
//           </button>
//         </div>
//         {showSmsOtpInput && (
//           <>
//             <div>Enter the OTP code we've sent to {smsOtpPhoneNumber}:</div>
//             <form
//               className="otp-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 setIsWrongSmsOtp(false);
//                 resolveSmsOtp();
//               }}
//             >
//               <input
//                 id="sms-otp"
//                 type="text"
//                 inputMode="numeric"
//                 pattern="[0-9]{6}"
//                 autoComplete="one-time-code"
//                 placeholder="OTP code"
//                 autoFocus
//                 title="OTP Code: should be 6 numbers"
//                 value={smsOtp}
//                 onChange={(e) => setSmsOtp(e.target.value)}
//                 disabled={!!awaitedSmsOtp && !isWrongSmsOtp}
//                 maxLength={6}
//               ></input>
//               <button
//                 type="submit"
//                 disabled={
//                   smsOtp.length < 6 || (!!awaitedSmsOtp && !isWrongSmsOtp)
//                 }
//               >
//                 Submit
//               </button>
//               <button
//                 disabled={!!awaitedSmsOtp && !isWrongSmsOtp}
//                 type="button"
//                 onClick={() =>
//                   cancelWaitingForSmsOtp(
//                     new Error("SMS OTP step up authentication cancelled")
//                   )
//                 }
//               >
//                 Cancel
//               </button>
//             </form>
//           </>
//         )}
//         {stepUpAuthIdToken && (
//           <div>
//             <div>
//               Good job, you stepped up authentication.
//               <br />
//               Your Consent ID was added to your ID-token:{" "}
//               <a
//                 href={`https://jwtinspector.kevhak.people.aws.dev/inspect#token=${stepUpAuthIdToken}&tab=payload`}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 view
//               </a>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="step-up-auth-error">
//         {!lastError && awaitedSmsOtp && isWrongSmsOtp && (
//           <div>That's not the right code</div>
//         )}
//         {lastError && <div>{lastError.message}</div>}
//       </div>
//     </div>
//   );
// }

// export default App;
