# Scene finder api

Dev memo.
At last I realized the response size limit of lambda and deleted it...
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/limits.html


## aws-serverless-express

https://github.com/awslabs/aws-serverless-express

```sh
npm install --save aws-serverless-express
```


## serverless

https://github.com/serverless/serverless

### Setup

1. Install

    ```sh
    # install
    npm install serverless -g

    # check serverless-cli is installed
    serverless --version
    ```

2. Configure credentials

    https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md#using-aws-profiles

    1. Create an IAM user and get an accesskey

        Note: need cloudformation role.
        Memo: how to create IAM with terraform is in /infra/scene-finder-api/main.tf

    2. Use aws-cli to configure aws credentials

        https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration-multi-profiles

        ```sh
        # check that aws-cli is installed
        aws --version

        # configure credentials
        aws configure --profile scene-finder
        # xxxxxxxx
        # xxxxxxxxxxxxxxxx
        # ap-northeast-1
        # txt
        less ~/.aws/credentials
        ```

### Plugin

* Serverless offline

    https://www.npmjs.com/package/serverless-offline

    ```sh
    # install
    npm i -D serverless-offline
    ```

* Serverless domain manager

    https://github.com/amplify-education/serverless-domain-manager

    ```sh
    # install
    npm i -D serverless-domain-manager
    ```

### Usage

0. Prepare serverless.yml

    See /app/scene-finder/serverless.yml.

1. Local check

    ```sh
    # run the local server with serverless-cli. Instead of running "node app.js"
    serverless offline
    #curl http://localhost:3000/

    # invoke a function
    #serverless invoke local -f fc-index -l  # it seems only for root path
    ```

2. Deploy

    ```sh
    # create the custom domain
    sls create_domain

    # Wait about 40 mins for its finish...
    # + add an A record in Route53
    ```

    ```sh
    # deploy to lambda with the custom domain
    sls deploy

    # Wait few mins.
    ```

    ```sh
    # check
    sls info
    sls deploy list functions
    #curl https://example.com/health

    # invoke the lambda function
    #serverless invoke -f fc-index -l  # it seems only for root path
    
    # logs
    sls logs -f fc-index
    ```

3. Configure base mapping in the custom domain

    https://ap-northeast-1.console.aws.amazon.com/apigateway/home?region=ap-northeast-1#/custom-domain-names

    * '/{proxy+}' as API gateway path, and '/' as custom domain base mapping.
        * All works.
        * Only one api (other api will not be able to use custom domain)

    * '/{proxy+}' as API gateway path, and '/ytdl' as custom domain
        * /health not works
        * /ytdl/download works

    * '/health' as API gateway path, and '/health' as custom domain
        * /health works
        * /ytdl/download not works

4. Destroy

    ```sh
    sls remove
    sls delete_domain
    # + delete an A record in Route53
    ```


## Others

### Thanks

https://medium.com/@kiesp/how-to-create-a-simple-api-using-lambda-and-api-gateway-part-1-4bde8e49939

https://serverless.com/blog/serverless-api-gateway-domain/

https://qiita.com/koshilife/items/bb7edb12f0285a241294

