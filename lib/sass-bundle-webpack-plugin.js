const fs = require("fs");
const path = require("path");

/**
 * Bundles SASS/SCSS files into one file
 */
class SassBundleWebpackPlugin {
  /**
   * Creates a new instance to be added into the
   * array of plugins in the webpack config file.
   *
   * @param {object} options
   * @property {string} options.file - the path to the main sass/scss file
   * @property {string} options.type - the extension of the file. Use either 'sass' or 'scss'
   * @property {object} options.output
   * @property {string} options.output.name - the name of compiled file
   */
  constructor(options) {
    this.options = options;
    this.sassBundle = "";
  }

  /**
   * This apply method is called by the webpack compiler
   * giving access to the entire compilation lifecycle.
   * see: https://webpack.js.org/concepts/plugins/
   *
   * @param {object} compiler
   */
  apply(compiler) {
    const { file, type, output } = this.options;
    const rootPath = file.replace(/[\.a-z]+$/g, "");
    const fileData = SassBundleWebpackPlugin.getFileData(file);
    const arrayFromSource = fileData.split("\n");
    const importedFilePaths = SassBundleWebpackPlugin.createListOfFilePaths(
      arrayFromSource,
      rootPath
    );

    /**
     * Hook before the compiler emits files to the disk
     * see: https://webpack.js.org/api/compiler-hooks/#emit
     */
    compiler.hooks.emit.tapAsync(
      "SassBundleWebpackPlugin",
      (compilation, callback) => {
        /**
         * Here we iterate over the list of file paths `importedFilePaths`
         * and populate the sassBundle string with the contents of each file.
         */
        importedFilePaths.forEach((path) => {
          const fileData = SassBundleWebpackPlugin.getFileData(path);
          this.sassBundle += fileData + "\n";
        });

        /**
         * Once the loop has ended, we build a new file of the specified name
         * and type, with the contents of the sassBundle string, and add to
         * the build.
         */
        compilation.assets[`${output.name}.${type}`] = {
          source: () => this.sassBundle,
          size: () => this.sassBundle.length,
        };

        /**
         * Let webpack continue
         */
        callback();
      }
    );
  }

  /**
   * Creates a list with filepaths from the sass imports
   * declared in the entry file (i.e. index.sass)
   *
   * @param {array} sourceArray - each line of the file split into an array
   * @param {string} rootPath - the directory of the file
   * @returns {string[]} - array of strings with the filepaths
   */
  static createListOfFilePaths(sourceArray, rootPath) {
    // use only lines that start with @import
    const filteredSource = sourceArray.filter((line) => line[0] == "@");

    return filteredSource.map((fileLine) => {
      const relativeFilePath = SassBundleWebpackPlugin.createPath(fileLine);
      const absoluteFilePath = path.resolve(rootPath, relativeFilePath);
      return absoluteFilePath;
    });
  }

  /**
   * Extracts the name of the file from the sass import statement
   *
   * @param {string} fileLine
   * @returns {string} - new string stripped off the @import, single quotes, and semicolon
   */
  static createPath(fileLine) {
    return fileLine.replace(/^(@import\s\'.\/)|\'|;/g, "");
  }

  /**
   * Gets the contents of a file. Includes error handling
   *
   * @param {string} file
   * @returns {string} - the contents of the file
   */
  static getFileData(file) {
    let data;

    try {
      data = fs.readFileSync(file);
    } catch (err) {
      throw err;
    }

    return data.toString("utf8");
  }
}

module.exports = SassBundleWebpackPlugin;
