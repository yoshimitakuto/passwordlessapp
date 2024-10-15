import { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  if (
    event.request.session &&
    event.request.session.length >= 3 &&
    event.request.session.slice(-1)[0].challengeResult === false
  ) {
    // ユーザの入力コードが3回間違っていた場合(認証失敗)
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  } else if (
    event.request.session &&
    event.request.session.length &&
    event.request.session.slice(-1)[0].challengeResult === true
  ) {
    // ユーザの入力コードが正しい場合(認証成功)
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // それ以外: ユーザの入力コードが正しくなく、3回間違えてない場合 (認証チャレンジ継続)
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  }

  return event;
};
