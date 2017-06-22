# DGLOs: A Dynamic Graph Visualization Library

## To set up workspace:
- install [yarn](https://yarnpkg.com) (if haven't already)
- open terminal
- `cd` to root directory of the repo
- `yarn install` to install dependencies
- Copy the gruntfile-pushed.js to a new file called gruntfile.js
- Put your main typescript (.ts) file in `src/ts/main`
- Set the mainfile variable in your gruntfile.js to the the filename without the .ts extension
- If you are using Visual Studio Code: cmd/ctrl-shift-b to start the webserver and autobuilder and open index.html

## Examples
- Specifying techniques using dGLOs examples be found in `src/ts/specs` directory.
- Examples of running these specifications can be found in the `src/ts/main` directory.


## While developing:
- `yarn add _____` to install dependencies
- `yarn add _____ -dev` to install developer tools
- `grunt gen_docs` to re-generate documentation
