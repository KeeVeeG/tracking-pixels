# Tracking Pixels

A simple Node.js Tracking Pixels tool

# Setup

Before starting set your SECRET key in environment inside docker-compose.yml file

`SECRET: 12345`
# Run

`docker compose up`

# Routes

## POST `/{SECRET}/create`

Create new tracking pixel

Payload: 
``` json 
{
    "name": "test",
    "email": "sdwq@gmail.com"
}
```

Response: 
``` json 
{
    "id": "0e6368d1bf71421b8fc5e46f2cf5fe09"
}
```

### GET `/image/{id}.png`

Insert picture in this link to your email message

## GET `/{SECRET}/pixel/{id}`

Get pixel victim data

Response: 
``` json 
{
    "id": "0e6368d1bf71421b8fc5e46f2cf5fe09",
    "name": "test",
    "email": "sdwq@gmail.com",
    "created": "2021-12-26T20:45:15.198Z",
    "data": {
        "IP": "94.140.141.257",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "OS": "Windows",
        "isMobile": "?0"
    },
    "watched": "2021-12-26T21:23:02.680Z"
}
```

## GET `/{SECRET}/users/`

Get info about all catched users

## GET `/{SECRET}/pixels/`

Get info about all created pixels
