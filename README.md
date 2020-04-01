# Video scene finder

It can find the scene of an image in a video.

Only work on local. (Failed to use lambda)


## Prerequisite

* [npm](https://github.com/npm/cli)


## Usage

0. Clone

1. Run the dev server

```sh
cd app/scene-finder/
npm run serve
```

2. Try

    1. Access to http://localhost:8080/

    2. Select an image.

    3. Select a video.

    4. Start finding by click the button at the bottom.


## Others

You can prepare a video by download from youtube.

Run the backend api server, which uses [node-ytdl-core](https://github.com/fent/node-ytdl-core).

```sh
cd app/scene-finder-api/
npm run dev
```

Access to http://localhost:8080/about/. Input youtube url and download it.


---

aws-serverless-express serverless with custom domain: Failed because the video response exceeds the size limit of lambda. => Need going through S3

後身
https://github.com/yokrh/scene-finder_0

