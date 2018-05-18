# AWS AppSync - AI Enabled Lambda Functions

This app demonstrates how you can use a Lambda function as an AWS AppSync datasource to perform really cool operations and return the result in a GraphQL query. In this example, we build an app that allows someone to put the text they would like to translate into the app, the app then returns the translation into voice for the user to play back.

## Getting Started

### React Native setup

1. clone the project   

```bash
git clone https://github.com/dabit3/appsync-lambda-ai.git
```

2. change directories into the project & install depencies   

```bash
cd appsync-lambda-ai
yarn || npm install
```

3. Add your AWS resources using the AWS Mobile CLI   

```bash
awsmobile init
```

_answer default to all questions_

4. Add cognito & Amazon S3 to the project      

```bash
awsmobile user-signin enable
awsmobile user-files enable
awsmobile push
```

5. Add AppSync configuration to the project   

_This will be described in the next section_

### Setting up the Lambda function

1. In the AWS dashboard, go to the [Lambda console](https://console.aws.amazon.com/lambda/)

2. Create a new function by clicking on __Create Function__

3. Give the function a name, choose the runtime as Node.js 8.10, choose __Create a custom role__ for the role, give the role a name of __lambda_ai_role__ & click __Allow__.

4. Click __Create Function__   

5. Next, we need to add permissions to the Lambda function in order to access other services (such as S3, Polly, & Translate). To do so, go to the IAM console, go to __Roles__, find & choose the __lambda_ai_role__, and add the following policies:

- AmazonS3FullAccess
- AmazonPollyFullAccess
- TranslateReadOnly

6. Finally, we need to add the actual lambda function we will be running! In the _lambda_ folder of this project, there is a lambda function (index.js) & a package.json file. In this directory, install the dependencies and then zip the folder into a zip file using the following command:

```bash
zip -r ../translate.zip *
```

Upload the zip file to Lambda as the function code and click __Save__

### AWS AppSync Setup

1. Create a new AWS ApppSync API, choose custom schema   

2. Define the following schema   

```
type Query {
	getTranslatedSentence(sentence: String!, code: String!): TranslatedSentence
}

type TranslatedSentence {
	sentence: String!
}
```

3. Create a lambda function data source   
- Click __Data Sources__
- Click __NEW_
- Give the data source a name, choose __AWS Lambda Function__ as the Data source type
- For the region, choose the region where you created the Lamba function
- For the Function ARN, choose the Lambda function you would like to use
- For the Role, choose __New Role__

4. Add a resolver to the __getTranslatedSentence__ query.   
- Click on Scheme in the left menu
- On the Right (under Data Types), click on __Attach__ next to the `getTranslatedSentence` field.
- For the Data Source name, choose the new data source we just created
- Click __Save__