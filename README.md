# Simple Url Shorten Service
Simple Url shorten serivce written in NodeJS.


## How to run
```
npm i && npm start
```

## How to use

Check if the service is running.
```
curl --location --request GET 'http://{HOST}:{PORT}'
```

Generate a new URL
```
curl --location --request POST 'http://{HOST}:{PORT}/shorten?url={URL}'
```

How to use generated link
```
curl --location --request GET 'http://{HOST}:{PORT}/{URL_HASH}'
```