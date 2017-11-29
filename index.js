// Create base directories
// Make gulpfile with project specific names
// Install gulp with requirements
// Download wordpress and unpack files

// execSync('npm install')

const create_project = ( () => {


  // NOTE: Name your project
  const PROJECT_NAME = 'tester'


  const {execSync} = require('child_process')
  const {promisify} = require('util')
  const fs = require('fs')
  const https = require('https');
  const httpsGet = promisify(https.get);
  const request = require('request')

  const WP_TAR_FILE_NAME = 'latest.tar.gz'
  const WP_LATEST_URL = 'https://wordpress.org/latest.tar.gz'
  const WP_DEFAULT_THEMES = ['twentyfifteen', 'twentysixteen']

  return {

    make_dir_sync (dir) {
      execSync('mkdir -p ' + dir)
    },

    unpack_tar_sync (file_name) {
      console.log('UNPACKING WORDPRESS\n')
      execSync(`tar -zxvf ${file_name}`)
      console.log('DONE..\n')
    },

    remove_default_wordpress_themes () {
      console.log('REMOVING DEFAULT WORDPRESS THEMES\n')
      WP_DEFAULT_THEMES.forEach( theme_name => {
        execSync(`rm -rf ./wordpress/wp-content/themes/${theme_name}`)
      })
      console.log('DONE..\n')
    },

    create_base_directories () {

      console.log('CREATING BASE DIRECTORIES\n')

      let base_directories = [
        './build/js',
        './build/scss'
      ]

      base_directories.forEach( this.make_dir_sync )

      console.log('DONE..\n')

    },

    create_gulpfile (theme_name) {
      console.log('CREATING CUSTOM GULPFILE\n')

      let gulpfile = fs.readFileSync('gulpfile.source.js', 'utf8')

      var result = gulpfile.replace(/\$\{theme_name\}/g, theme_name)

      fs.writeFile( 'gulpfile.js', result, 'utf8', err => true || console.log(err) )

      console.log('DONE..\n')
    },

    async download_wordpress_latest () {

      console.log('DOWNLOADING WORDPRESS\n')

      let file = fs.createWriteStream(WP_TAR_FILE_NAME)

      return new Promise( ( resolve, reject ) => {

        let stream = request(WP_LATEST_URL).pipe(file)
        stream.once('finish', _ => {
          console.log('DONE..\n')
          resolve(true)
        });
        stream.once('error', err => reject(err) );

      })

    },

    async init () {

      console.log(`WELCOME! STARTING ${PROJECT_NAME} PROJECT SETUP\n`)

      this.create_base_directories()

      this.create_gulpfile( PROJECT_NAME )

      try {
        let download_wordpress_tar = await this.download_wordpress_latest()

        this.unpack_tar_sync(WP_TAR_FILE_NAME)
        this.remove_default_wordpress_themes()
      } catch ( err ) {
        console.error(err)
      }

      console.log('INSTALLING NODE DEPENDENCIES\n')
      execSync('npm install')
      console.log('DONE..\n')

      console.log('PROJECT CREATED!\n')

    }
  }

})()

create_project.init()
