# UML Editor  [![build](https://travis-ci.org/davidkwan95/uml-editor.svg?branch=master)]() [![node](https://img.shields.io/badge/Node.js-8.4.0-green.svg)]()

[UML Editor](https://davidkwan95.github.io/uml-editor) is a UML diagramming tools that fully runs on browser. It is intended to be a CASE tool like StarUML, but running on browser.

UML Editor uses [mxGraph](https://github.com/jgraph/mxgraph) library and the [GraphEditor](https://github.com/jgraph/mxgraph/tree/master/javascript/examples/grapheditor) example as the base of this project.


## Features
- [x] Class diagrams
- [x] Generate Java code from Class Diagram
- [ ] Validate syntax before generating code
- [ ] Multi user working


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

[Yarn](https://yarnpkg.com/en/)

```
npm install -g yarn
```

### Installing

Install dependencies

```
yarn install
```

Run development server

```
yarn dev
```

Open `localhost:8080` in browser


## Coding style

There is a `.eslintrc` file that contains all the rules of the coding style. A lot of the files are still being rewrite to conform to these rules.


## Contributing

There are ways to contribute to this project:
1. Making pull request
2. Opening issue(s)

### Pull Request
1. Fork this repo
2. Commit your changes to a separate branch
3. Make a pull request


## Built With

* [mxGraph](https://github.com/jgraph/mxgraph) - The library used for diagramming
* [Yarn](https://yarnpkg.com/en/) - Dependency Management
* [Babel](https://babeljs.io/) - ES6 to ES5 transpiler
* [Webpack](https://webpack.js.org/) - Module bundler
* [Travis CI](https://travis-ci.org/) - Code Integration

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details


## Acknowledgment

* Yani Widyani S.T.,M.T. as my supervisor for this thesis
