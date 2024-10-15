#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TestYoshimiAuthStack } from "../lib/auth-stack";

const app = new cdk.App();
new TestYoshimiAuthStack(app, "TestYoshimiAuthStack");
