# nateReactServerWordCount
Client server application in where the user submits a url text and the application
fetches a text document. The application returns a word count from that text document.

<img src="src/pictures/nateFormGif.gif" title="nate"/>

## To Run:

```
git clone https://github.com/jolaya182/nateServerWordCount.git
```

In src folder:
```
npm  start
```
or

```
npm run-script runserver

npm run-script startwebapplication
```

To build 
```
npm run-script prebuild
```

go to `http://localhost:8080/` url on your webbrowser


To use jest test on the backend
```
jest index.test.js 
```
To use puppeteer on the front end
```
jest puppeteer.test.js
```

_client server application that submits a ulr and text document and returns a word count of that text document_

_reasons for the tech stack_ 

```
    JSON: stores the text in an object that serves as a hash table to when retrieving 
    URLs and their words. This minimizes the amount of technology used for this project.
    node: the ability to create quick servers and use frameworks that are still being supported like superagent. It is very well suited for front-end applications that have to deal with real-time solutions, messengers, end-to-end testing, IoT, and streaming platforms.
    react: hooks makes it very simple to mount and unmount data on fetch requests and Html composition. 
    The composition of the functions can be easily tested with other libraries like 'enzyme'. The unidirectional composition allows for concerns to be separated into smaller components.
    jest: watch mode is amazing and the console log works very well with technologies like 'puppeteer'. 
    puppeteer: puppeteer uses javascript as a headless browser, it is very well documented and maintained. 
    The methods naming are very well thought-out and easy to adapt. The setup is fairly simple and convenient to use.

```