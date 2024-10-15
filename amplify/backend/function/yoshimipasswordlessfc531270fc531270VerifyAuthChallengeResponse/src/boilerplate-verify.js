/**
 * @type {import('@types/aws-lambda').VerifyAuthChallengeResponseTriggerHandler}
 */
// exports.handler = async (event) => {
//   if (event.request.privateChallengeParameters.answer === event.request.challengeAnswer) {
//     event.response.answerCorrect = true;
//   } else {
//     event.response.answerCorrect = false;
//   }

//   return event;
// };

exports.handler = async (event) => {
  const expectedAnswer =
    event.request.privateChallengeParameters.secretLoginCode;

  if (event.request.challengeAnswer === expectedAnswer) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }

  return event;
};
