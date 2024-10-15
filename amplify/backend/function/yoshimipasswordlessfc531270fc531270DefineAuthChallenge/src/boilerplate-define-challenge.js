/**
 * @type {import('@types/aws-lambda').DefineAuthChallengeTriggerHandler}
 */
// exports.handler = async (event) => {
//   if (event.request.session.length === 1 && event.request.session[0].challengeName === 'SRP_A') {
//     event.response.issueTokens = false;
//     event.response.failAuthentication = false;
//     event.response.challengeName = 'PASSWORD_VERIFIER';
//   } else if (
//     event.request.session.length === 2 &&
//     event.request.session[1].challengeName === 'PASSWORD_VERIFIER' &&
//     event.request.session[1].challengeResult === true
//   ) {
//     event.response.issueTokens = false;
//     event.response.failAuthentication = false;
//     event.response.challengeName = 'CUSTOM_CHALLENGE';
//   } else if (
//     event.request.session.length === 3 &&
//     event.request.session[2].challengeName === 'CUSTOM_CHALLENGE' &&
//     event.request.session[2].challengeResult === true
//   ) {
//     event.response.issueTokens = true;
//     event.response.failAuthentication = false;
//   } else {
//     event.response.issueTokens = false;
//     event.response.failAuthentication = true;
//   }

//   return event;
// };

exports.handler = async (event) => {
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
