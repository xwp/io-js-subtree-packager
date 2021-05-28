const fs = require( 'fs' );
const ComposerPackage = require( './composer-package' );

jest.mock( 'fs' );

test( 'can resolve Composer meta file', () => {
	const testPackage = new ComposerPackage( 'path/to/package-slug' );

	expect( testPackage.metaFile() ).toEqual( 'path/to/package-slug/composer.json' );
} );

test( 'can resolve Composer meta contents', () => {
	const testPackage = new ComposerPackage( 'path/to/another/package-slug' );

	const packageMeta = {
		name: 'package-slug',
		version: '1.0.0',
	};

	fs.readFileSync.mockReturnValue( JSON.stringify( packageMeta ) );

	expect( testPackage.meta() ).toEqual( packageMeta );
	expect( testPackage.version() ).toEqual( '1.0.0' );
} );
