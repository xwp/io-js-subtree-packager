const fs = require( 'fs' );
const git = require( 'simple-git' );

class SubtreePackage {
	constructor( repoDir, targetPackage ) {
		this.repoDir = repoDir;
		this.repo = git( repoDir );
		this.targetPackage = targetPackage;
	}

	targetPackageDirRelative() {
		return this.targetPackage.dir().replace( this.repoDir, '' ).substring( 1 );
	}

	async tagSubtreeVersion( remoteUrl, targetBranch = null ) {
		const packageDirRelative = this.targetPackageDirRelative();
		const subtreeBranch = 'subtree-' + packageDirRelative;
		const repoBranch = await this.repo.branch();

		// Ensure we remove any existing subtree branches.
		if ( repoBranch.all.includes( subtreeBranch ) ) {
			await this.repo.deleteLocalBranch( subtreeBranch, true );
		}

		// Use the local source branch if target branch isn't specified.
		if ( ! targetBranch ) {
			targetBranch = repoBranch.current;
		}

		// Now split the package directory into own branch.
		const splitHash = await this.repo.raw(
			[ 'subtree', 'split', `--prefix=${ packageDirRelative }`, `--branch=${ subtreeBranch }` ]
		);

		// Specify which refspecs to push.
		const pushRevisionPairs = [
			`${ subtreeBranch }:${ targetBranch }`,
		];

		// Create a tag at this split.
		const targetVersion = this.targetPackage.version();

		// Tag the subtree hash locally to allow pushing it up.
		if ( splitHash && targetVersion ) {
			const splitTag = `split-${ packageDirRelative }-${ targetVersion }`;

			// Create a local tag that references the split revision.
			await this.repo.tag( [ splitTag, splitHash.trim(), '--force' ] );

			// Ensure we push that tag to the upstream.
			pushRevisionPairs.push( `refs/tags/${ splitTag }:refs/tags/${ targetVersion }` );
		}

		await this.repo.push( remoteUrl, [ ...pushRevisionPairs, '--no-verify', '--force' ] );
		await this.repo.deleteLocalBranch( subtreeBranch, true );
	}

	rmDir( path ) {
		fs.rmdirSync( path, { recursive: true } );
	}

	resetDir( path ) {
		this.rmDir( path );
		fs.mkdirSync( path );
	}
}

module.exports = SubtreePackage;
