# Subtree Packager

Split and publish parts of your monorepo to dedicated Git repositories.

## Install

	npm install @xwp/subtree-packager --save-dev

## Usage

	```js
	const { SubtreePackage, ComposerPackage } = require( '@xwp/subtree-packager' );
	
	// Point to a directory that should be split into a standalone package.
	const packageToSplit = new ComposerPackage( 
		'/absolute/path/to/composer/package' 
	);

	// Point the git subtree helpers to the package.
	const publishPackage = new SubtreePackage( 
		'/absolute/path/to/monorepo', 
		packageToSplit 
	);

	// Create a split branch from the current monorepo branch
	// and push it to the package repository. Also push a tag matching
	// the version string in composer.json of the package.
	publishPackage.tagSubtreeVersion( 
		'git@github.com:upstream/repository-slug.git' 
	);
	```
