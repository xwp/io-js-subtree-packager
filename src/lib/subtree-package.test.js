const git = require( 'simple-git' );
const SubtreePackage = require( './subtree-package' );
const ComposerPackage = require( './composer-package' );

jest.mock( 'simple-git' );

test( 'can resolve subtree package path relative to the monorepo root', () => {
	const dirs = {
		root: '/path/to/package-slug',
		subtree: '/path/to/package-slug/path/to/subtree',
	};

	const testPackage = new ComposerPackage( dirs.subtree );
	const subtreePackage = new SubtreePackage( dirs.root, testPackage );

	expect( subtreePackage.targetPackageDirRelative() ).toEqual( 'path/to/subtree' );
	expect( git ).toBeCalledWith( dirs.root );
} );
