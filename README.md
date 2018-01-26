 mon# our-school-liberia

Under Development


Multilingual Website for Our School in Liberia (A school in Liberia).

Using Keystonejs (https://github.com/keystonejs/keystone)


## Installation

* Clone
* install node (i'm on 5.6)
* install mongodb
* run node keystone.js


### Notes on language use

There is a language router map (routes/langRouteMap.js) Here langauge configuration can be specified and is flexible.

#### Url Mapping

The primary purpose of the map is to link different languages to different urls for localised url names. Hitting the langauge change will map the url to the equivalent route for the alternate langauge.

Controllers will be responsible for doing appropriate lookups on any parameters passed in order to retrieve the correct content, (perhaps redirecting again to get a clean, completely localised url);


#### Templates

Pages can either be static (rendered jade template only), or dynamic (controller specified), this only implied by use of a controller or templates configuration.

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


### Assumptions to be tested

* Navigation need not be parallel.


### Todo

* linking language versions together in keystone
* Notification that content is not available in alternate language? Flash message?
