# our-school-liberia

Under Development


Multilingual Website for Our School in Liberia (A school in Liberia).

Using Keystonejs (https://github.com/keystonejs/keystone)


## Installation

* Clone
* install node (i'm on 6.11.4 using nvm)
* install mongodb
* create `.env` file (see below)
* run node keystone.js


### Environment File `.env` 

You should create a file in the root directory called `.env`.
This file should never be committed to source control.

The following environment variables are used for various sections of the site
they are not all referenced in the code but the keystone package uses some.
```
NODE_ENV=development
CLOUDINARY_URL=
S3_BUCKET=
S3_KEY=
S3_SECRET=
S3_REGION=
GOOGLE_SERVER_KEY=
GOOGLE_BROWSER_KEY=
EMBEDLY_API_KEY=
MAILGUN_KEY=
MAILGUN_DOMAIN=
```


### Notes on language use

There is a language router map (routes/langRouteMap.js) Here langauge configuration can be specified and is flexible.

#### Url Mapping

The primary purpose of the map is to link different languages to different urls for localised url names. Hitting the langauge change will map the url to the equivalent route for the alternate langauge.

Controllers will be responsible for doing appropriate lookups on any parameters passed in order to retrieve the correct content, (perhaps redirecting again to get a clean, completely localised url);


#### Templates

Pages can either be static (rendered pug template only), or dynamic (controller specified), this only implied by use of a controller or templates configuration.

Static pages can either specify a 'templatePrefix' to have seperate templates per language (template files suffixed '-en', or '-de', etc), or a 'sharedTemplate'. All templates have access to i18n functions which do lookups on translations listed in /locales/en.js etc, most useful for the shared templates.

So far, dynamic pages share a controller across languages.  


#### Environment set up (.env)
1. Create Cloudinary account
2. Create paypal business account and app
3. Create Amazon account and S3 Bucket

4. Create .env file with the following content
CLOUDINARY_URL=cloudinary://<your full url>
EMBEDLY_API_KEY=...
Paypal_Client_ID=<your id>
Paypal_Secret=<your secret id>
Site_URL=http://localhost:3000 <return URL for paypal payments>
S3_BUCKET=<AWS S3 bucket name for file upload>
S3_KEY=<your key>
S3_SECRET=<your secret key>
S3_Region=<region cannot be Frankfurt !! ap-northeast-1 worked>


#### Navigation

A separate file (routes/langNavMap.js), details the navigation structure for each available language.


