# CupWatch

## What is it ?

Cupwatch is a website that allows you to create a collaborative playlist of youtube videos.

## How to install

1. Clone the repo : ```git clone https://github.com/TxReplay/CupWatch.git```
2. Go to your ```cd CupWatch ```
3. Install Composer : ```curl -sS https://getcomposer.org/installer | php``` (or ```composer install``` if already installed globally)
4. Install vendors : ```composer.phar install```
5. Create an ```api_keys.json``` like this at the root folder :

```
{
  "youtube": {
    "DEVELOPER_KEY": "<DEVELOPER_KEY>"
  },
  "firebase": {
    "ref": "<FIREBASE URL>"
  }
}
```

*Note :* To create your API, go to the [Youtube developer documentation API](https://developers.google.com/youtube/v3/getting-started?hl=fr).