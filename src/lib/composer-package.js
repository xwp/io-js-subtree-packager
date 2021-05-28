const fs = require( 'fs' );
const path = require( 'path' );

class ComposerPackage {
	constructor( packageDir ) {
		this.packageDir = packageDir;
	}

	dir() {
		return this.packageDir;
	}

	metaFile() {
		return path.join( this.packageDir, 'composer.json' );
	}

	meta() {
		return JSON.parse( fs.readFileSync( this.metaFile() ) );
	}

	version() {
		const meta = this.meta();

		if ( 'string' === typeof meta.version ) {
			return meta.version;
		}

		return null;
	}
}

module.exports = ComposerPackage;
