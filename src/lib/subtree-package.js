const git = require( 'simple-git' );

class SubtreePackage {
	constructor( sourcePath ) {
		this.git = git( sourcePath );
	}

	async split( sourceDir, subtreeBranch ) {
		const repoBranch = await this.git.branch();

		// Ensure we remove any existing subtree branches.
		if ( repoBranch.all.includes( subtreeBranch ) ) {
			await this.git.deleteLocalBranch( subtreeBranch, true );
		}

		return await this.git.raw(
			[ 'subtree', 'split', `--prefix=${ sourceDir }`, `--branch=${ subtreeBranch }` ]
		).then( ( hash ) => hash.trim() );
	}
}

module.exports = SubtreePackage;
