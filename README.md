# nateServerWordCount
client server application that submits a ulr and text document and returns a word count of that text document

<!-- <img src="src/pictures/.gif" title="UiDirectory"/> -->

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

go to `http://localhost:8080/` on your webbrowser


To use jest test
```
jest index.test.js 
```


_client server application that submits a ulr and text document and returns a word count of that text document_

_reasons for the tech stack_ 

```
    json: store the text in an oject that serves as a hash table to when retriving 
    urls and its words.
    node: the ability to create quick servers and use frameworks that are still being
    supported like superagent
    react: hooks makes it very to simple to mount and unmount data on fetch requests and html composition.
    jest: watch mode is amazing and the console log works very well. 
    puppeteer: very well documented and maintained. The methods naming are very well thought and easy to adapt. The setup is fairly simple and convienent to use.
```