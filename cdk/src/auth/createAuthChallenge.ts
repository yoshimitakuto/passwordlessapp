import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { randomDigits } from "crypto-secure-random-digit";
import { SNS } from "aws-sdk";

const sns = new SNS({ region: "ap-northeast-1" });

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  let secretLoginCode: string;
  if (!event.request.session || !event.request.session.length) {
    // 新しいセッションの場合
    // 新しいシークレットログインコードを生成して、メール送信
    secretLoginCode = randomDigits(6).join("");
    await sendSMS(event.request.userAttributes.phone, secretLoginCode);
  } else {
    // 既存のセッションの場合
    // 新規にコードは生成せず、既存セッションのコードを再利用
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode =
      previousChallenge.challengeMetadata!.match(/CODE-(\d*)/)![1];
  }

  // クライアントアプリに送り返す
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };

  // ログインコードをパラメータに追加し、"Verify Auth Challenge Response"トリガーによって認証されるようにする
  event.response.privateChallengeParameters = { secretLoginCode };

  // ログインコードをセッションに追加し、次回の"Create Auth Challenge"トリガーで利用できるようにする
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

// sms送信
async function sendSMS(phoneNumber: string, secretLoginCode: string) {
  const params = {
    // 先頭の0を+81に置き換える
    PhoneNumber: phoneNumber.replace(/^0*/, "+81"),
    Message: `Your login code: ${secretLoginCode}`,
  };
  await sns.publish(params).promise();
}
