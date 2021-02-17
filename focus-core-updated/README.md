**Currently in dev**

Technical stack for spa application.

## structure
Here is  the library structure. It works with focus components. 

- Structure:
```
index.js //entry point
__application/ //All application related functions/ helper
__definition/ // all the domain and metadata informations
__component // Component functions /helper
__helper // Global helpers
__exception // Global exceptions using error object
__network // Network layer (fech, //)
__router // Router related functions.
__store //Store related methods
__util //Utility functions
```

## Unit tests
All unit tests are written with mocha, and can be launched using the `npm run test` command.
It uses **mocha**.

debug unit tests
`npm run test:debug`


## Dependencies

- Focus is written using the latest JS standards (ECMASCRIPT6/2015) and uses [babeljs](https://babeljs.io/) to transpile into ES5 for the browser.
- [React](http://facebook.github.io/react/) is used as a view layer / rendering engine.
- [Lodash](https://lodash.com/) is used to provide lots of helpfull standard utility functions.

## Documentation and help
See our [wiki](https://github.com/KleeGroup/focus/wiki)
See our [documentation](https://kleegroup.github.io/focus-docs)


## How to build the lib
The build system is made with `gulp` which is a node base build system. 
Then you have to launch the following command: `npm run build` which generates two outputs: one for the browser, one for node js (expecially for unit tests purpose).
All build dependencies are listed into the **devDependencies** of the `package.json` file.

## Lint
`npm run eslint` in order to see your errors.

## Dependencies

In order to install all your dependencies: `npm install --no-optional`

### Browser

The browser build is inside the `dist/focus.js`

### Node js

Focus is publish under the name [focusjs](https://www.npmjs.com/package/focusjs) on npm.
In order to use focus you can user `require('focus')`
You can require submodules of focus such as the network: `require('focus/network/fetch')` or `require('focus').network.fetch`.
