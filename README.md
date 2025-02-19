# Havard FCU Membership Eligibility Tool

This code was written in React + TypeScript + Vite, by **Code For Boston**, a non-profit grassroots organization run by volunteers

## Where is the code stored and how do we access it if we need to make changes?

The code is stored on this Github repo, it is then injected into the WordPress dev site ( https://huecu2020.insegment.com/membership-old/eligibility/).  The entire functionality is contained in the above repo, however, changes to WordPress styling may affect the visual appearance of the page.

Code injected into WPbakery page builder as raw HTML
```html
<div id="eligibility-root"></div>
<script src="https://codeforboston.github.io/harvard-fcu/assets/index.js" type="module" ></script>
<link rel="stylesheet" href="https://codeforboston.github.io/harvard-fcu/assets/index.css">
```

## Where are visual assets stored?

The '/assets' folder in this repo

## How would I move the features you built to another CMS if we decide to move away from WordPress

Copy the raw HTML from the WPbakery page builder and inject it into the respective section of your new CMS.


## How do I change/update things like the test of messages and other visual elements?

Locate visual elements or test messages, update them accordingly, and submit a pull request to this repo.

## What APIs are in use and how do we check/maintain them if they stop working?

U.S. Census Bureau’s Geocoding Services Web API;
Census Geocoding API URLs for reference
https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

Google Maps API ([https://console.cloud.google.com/](https://developers.google.com/maps/documentation/javascript/reference/))

## How did we resolve the analytics issue?
TBD
