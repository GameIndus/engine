<p align="center">
    <img src="https://i.imgur.com/2Ax3HgL.png" alt="Logo de GameIndus" width="600">
</p>

<h1 align="center">2D Game engine</h1>
<h4 align="center">
Modern and customizable web-based 2D engine
<br>
Created for the new-generation GameIndus platform :rocket:
</h4>

<p align="center">
    <a href="https://travis-ci.com/gameindus/engine-2d">
        <img src="https://img.shields.io/travis/com/gameindus/engine-2d.svg" alt="Travis">
    </a>
    <a href="https://sonarcloud.io/dashboard?id=fr.gameindus.engine-2d">
        <img src="https://sonarcloud.io/api/project_badges/measure?project=fr.gameindus.engine-2d&metric=alert_status" alt="SonarQube Quality gate">
    </a>
    <a href="https://twitter.com/GameIndus">
        <img src="https://img.shields.io/twitter/follow/GameIndus.svg?style=social&label=Follow%20us%20on%20Twitter" alt="Follow us">
    </a>
    <a href="https://discord.gg/fvYYeD5">
        <img src="https://img.shields.io/discord/177737791680151553.svg" alt="Discord">
    </a>
    <br>
    <a href="https://github.com/GameIndus/engine-2d/commits/master">
        <img src="https://img.shields.io/github/last-commit/GameIndus/engine-2d/master.svg" alt="GitHub last commit">
    </a>
    <a href="https://github.com/GameIndus/engine-2d/blob/master/LICENSE.md">
        <img src="https://img.shields.io/badge/License-GPL--3.0-green.svg" alt="License">
    </a>
</p>

>
> This game engine is still in development and can contains bugs. You can help the development by doing pull requests.
> Originally developed by [Utarwyn](https://github.com/utarwyn). 
>

### Key features ###

- Optimized Canvas renderer
- Full scene managment
- Assets loader
- Full mouse/keyboard/gamepad interaction support
- Text support
- A large bunch of utility methods!
- And a very easy API! :fire:

### Which awesome tools does this game engine use? ###

* **Typescript**, an open-source programming language developed and maintained by Microsoft. It enables us to have a more reliable and maintainable code with classes and namespaces.
* **Webpack** to compile all Typescript code into a native JavaScript code readable by all modern browsers. It also provides a file watching system to help us when we develop the engine.
* **TSLint**, an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors.
* **Jest**, a delightful JavaScript Testing Framework with a focus on simplicity.

All these tools are working together thanks to NodeJs. You can find all used packages in the Node config file.

### How to build? ###

1. First you need NodeJs and Npm installed. Then, in the folder where you have cloned
the repository, install the build dependencies using npm:
```sh
npm install
```

2. You can test the source code by running:
```sh
npm run test
```

Then, to build the source, you just have to run:
```sh
npm run build
```

If you prefer to compile with the file watching system, run:
```sh
npm run watch
```

### License ###

This content is released under the (https://opensource.org/licenses/GPL-3.0) GPL-3.0 License.\
See [LICENSE](https://github.com/GameIndus/engine-2d/blob/master/LICENSE) file

---

> GitHub [@Gameindus](https://github.com/gameindus) &nbsp;&middot;&nbsp;
> Twitter [@GameIndus](https://twitter.com/GameIndus)
