# Scene finder api

Dev memo


## aws-serverless-express

https://github.com/awslabs/aws-serverless-express

```sh
npm install --save aws-serverless-express
```


## Serverless

https://github.com/serverless/serverless
https://stackoverflow.com/questions/52251075/how-to-pass-parameters-to-serverless-invoke-local

### setup

1. install

    ```sh
    # install
    npm install serverless -g

    # check serverless-cli is installed
    serverless --version
    ```

2. configure credentials

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

### plugin

* Serverless offline

https://www.npmjs.com/package/serverless-offline

```sh
# install
npm i -D serverless-offline
```

* Serverless domain manager

https://github.com/amplify-education/serverless-domain-manager
https://serverless.com/blog/serverless-api-gateway-domain/
https://qiita.com/koshilife/items/bb7edb12f0285a241294

```sh
# install
npm i -D serverless-domain-manager
```

### Usage

0. prepare serverless.yml

    See /app/scene-finder/serverless.yml.

1. local check

    ```sh
    # run the local server with serverless-cli. Instead of running "node app.js"
    serverless offline
    #curl http://localhost:3000/

    # invoke a function
    #serverless invoke local -f fc-index -l  # it seems only for root path
    ```

2. deploy

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

3. check

    ```sh
    sls info
    sls deploy list functions
    #curl https://example.com/health

    # invoke the lambda function
    #serverless invoke -f fc-index -l  # it seems only for root path
    ```

4. destroy

    ```sh
    sls remove
    sls delete_domain
    ```


## Others

Thanks
https://medium.com/@kiesp/how-to-create-a-simple-api-using-lambda-and-api-gateway-part-1-4bde8e49939

