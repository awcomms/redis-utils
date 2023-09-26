import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { inc } from 'semver';

let mode = process.argv[2];
if (!['patch', 'major', 'minor'].includes(mode)) {
	console.error('invalid mode: ', mode);
	process.abort(1);
}

let m = process.argv[3] || '.';

const pj_path = './package.json';
const pj = JSON.parse(readFileSync(pj_path));

pj.version = inc(pj.version, mode);

writeFileSync(pj_path, JSON.stringify(pj));

const execs = (commands) => {
	for (let i = 0; i < commands.length; i++) {
		exec(commands[i], (err, stdout, stderr) => {
		console.log(commands[i]);
			if (stdout) console.log('std_out: ', stdout);
			if (stderr) console.log('std_out: ', stderr);
			if (err) {
				console.error(err)
				process.abort(1)
			}
		});
	}
};

execs(['git add .', `git commit -m "${m}"`, 'git push', 'npm publish --access public']);
