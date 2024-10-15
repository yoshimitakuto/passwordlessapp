import * as cdk from "aws-cdk-lib";
// import {
//   AwsCustomResource,
//   AwsCustomResourcePolicy,
//   PhysicalResourceId,
// } from "aws-cdk-lib/custom-resources";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { EmailSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";

// 環境変数読み込み
// const userPoolId = process.env.COGNITO_USER_POOL_ID ?? "";
const email = process.env.EMAIL ?? "";

export class TestYoshimiAuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 既存のUser Poolを参照
    // const existingUserPool = UserPool.fromUserPoolId(
    //   this,
    //   "ExistingUserPool",
    //   userPoolId
    // );

    // SNSTopicを作成
    const snsTopic = new sns.Topic(this, "TestYoshimiSnsTopic", {
      displayName: "test-yoshimi-sns-topic-with-amplify-auth",
    });
    // snsTopic.addSubscription(new EmailSubscription(email));

    // define function
    const defineAuthChallengeFn = new NodejsFunction(
      this,
      "DefineAuthChallengeFn",
      {
        functionName: "test-yoshimi-define-auth-challenge-function",
        entry: "src/auth/defineAuthChallenge.ts",
        runtime: Runtime.NODEJS_20_X,
      }
    );

    // create auth challenge function
    const createAuthChallengeFn = new NodejsFunction(
      this,
      "CreateAuthChallengeFn",
      {
        functionName: "test-yoshimi-create-auth-challenge-function",
        entry: "src/auth/createAuthChallenge.ts",
        runtime: Runtime.NODEJS_20_X,
      }
    );
    snsTopic.grantPublish(createAuthChallengeFn); // SMS認証コード送信権限を付与

    // verify auth challenge function
    const verifyAuthChallengeFn = new NodejsFunction(
      this,
      "VerifyAuthChallengeFn",
      {
        functionName: "test-yoshimi-verify-auth-challenge-function",
        entry: "src/auth/verifyAuthChallenge.ts",
        runtime: Runtime.NODEJS_20_X,
      }
    );

    // カスタムリソースで使用する IAM ロールを作成
    // const customResourceRole = new iam.Role(this, "CustomResourceRole", {
    //   assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    // });

    // customResourceRole.addToPolicy(
    //   new iam.PolicyStatement({
    //     actions: ["iam:PassRole"],
    //     resources: [`arn:aws:iam::${this.account}:role/SMSRole`],
    //   })
    // );

    // IUserPoolにaddTrigger()が存在しないため、カスタムリソースでUser Poolにlambdaトリガーを追加
    // new AwsCustomResource(this, "UpdateUserPool", {
    //   resourceType: "Custom::UpdateUserPool",
    //   onCreate: {
    //     region: this.region,
    //     service: "CognitoIdentityServiceProvider",
    //     action: "updateUserPool",
    //     parameters: {
    //       UserPoolId: existingUserPool.userPoolId,
    //       SmsConfiguration: {
    //         SnsCallerArn: customResourceRole.roleArn, // SNS Caller Role ARN を指定
    //         SnsRegion: "ap-northeast-1", // SNS が存在するリージョンを指定
    //       },
    //       LambdaConfig: {
    //         DefineAuthChallenge: defineAuthChallengeFn.functionArn,
    //         CreateAuthChallenge: createAuthChallengeFn.functionArn,
    //         VerifyAuthChallengeResponse: verifyAuthChallengeFn.functionArn,
    //       },
    //       // AutoVerifiedAttributesに必要な属性を追加
    //       AutoVerifiedAttributes: ["phone_number"],
    //     },
    //     physicalResourceId: PhysicalResourceId.of(existingUserPool.userPoolId),
    //   },
    //   policy: AwsCustomResourcePolicy.fromSdkCalls({
    //     resources: AwsCustomResourcePolicy.ANY_RESOURCE,
    //   }),
    // });

    // user pool settings
    const userPool = new UserPool(this, "UserPool", {
      userPoolName: "test-yoshimi-user-pool",
      selfSignUpEnabled: true,
      signInAliases: { phone: true },
      lambdaTriggers: {
        defineAuthChallenge: defineAuthChallengeFn,
        createAuthChallenge: createAuthChallengeFn,
        verifyAuthChallengeResponse: verifyAuthChallengeFn,
      },
    });
  }
}
