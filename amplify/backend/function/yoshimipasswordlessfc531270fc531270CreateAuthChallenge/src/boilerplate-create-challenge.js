/**
 * @type {import('@types/aws-lambda').CreateAuthChallengeTriggerHandler}
 */

const { SNS } = require("aws-sdk");
const { randomDigits } = require("crypto-secure-random-digit");

const sns = new SNS({
  region: "ap-northeast-1",
});

// exports.handler = async (event) => {
//   if (
//     event.request.session.length === 2 &&
//     event.request.challengeName === "CUSTOM_CHALLENGE"
//   ) {
//     event.response.publicChallengeParameters = { trigger: "true" };

//     event.response.privateChallengeParameters = {};
//     event.response.privateChallengeParameters.answer =
//       process.env.CHALLENGEANSWER;
//   }
//   return event;
// };

exports.handler = async (event) => {
  let secretLoginCode;

  // サインアップ・サインイン時両方でセッションコードを生成する
  secretLoginCode = randomDigits(6).join("");
  await sendSMS(event.request.userAttributes.phone_number, secretLoginCode);

  // if (!event.request.session || !event.request.session.length) {
  //   // 新しいセッションの場合
  //   // 新しいシークレットログインコードを生成して、メール送信
  //   console.log("新たしいセッション", event.request.session);
  //   secretLoginCode = randomDigits(6).join("");
  //   await sendSMS(event.request.userAttributes.phone_number, secretLoginCode);
  // } else {
  //   // 既存のセッションの場合
  //   // 新規にコードは生成せず、既存セッションのコードを再利用
  //   console.log("既存のセッション", event.request.session);
  //   const previousChallenge = event.request.session.slice(-1)[0];
  //   secretLoginCode =
  //     previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
  // }

  // クライアントアプリに送り返す
  event.response.publicChallengeParameters = {
    phone: event.request.userAttributes.phone_number,
  };

  // ログインコードをパラメータに追加し、"Verify Auth Challenge Response"トリガーによって認証されるようにする
  event.response.privateChallengeParameters = { secretLoginCode };

  // ログインコードをセッションに追加し、次回の"Create Auth Challenge"トリガーで利用できるようにする
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

// sms送信
async function sendSMS(phoneNumber, secretLoginCode) {
  const params = {
    // 先頭の0を+81に置き換える
    PhoneNumber: phoneNumber,
    Message: `Your login code: ${secretLoginCode}`,
  };
  await sns.publish(params).promise();
}
