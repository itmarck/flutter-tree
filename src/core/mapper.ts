import { Node } from './node';
import { symbols } from './constants';

// Abbreviation to Node tree
export function mapperSingleLine(abbr: string, options?: object): Node {
	return getChildren(abbr);
}

export function mapperMultiLine(selection: string): Node {
	return new Node('');
}

function getChildren(abbr: string): Node {
	if (isSingleChild(abbr)) {
		return getSingleChild(abbr);
	} else {
		return getMultiChild(abbr);
	}
}

function getSingleChild(abbr: string): Node {
	let name: string;
	let node: Node;
	let position = abbr.indexOf(symbols.childBuilder);

	if (position === -1) {
		name = abbr.substring(0, abbr.length);
		node = new Node(name);
	} else {
		name = abbr.substring(0, position);
		let child = getChildren(abbr.substring(position + 1, abbr.length));
		node = new Node(name, child);
	}

	return node;
}

function getMultiChild(abbr: string): Node {
	let position = abbr.indexOf(symbols.childrenBuilder);
	let name = abbr.substring(0, position);

	let abbrWithoutName = abbr.substring(position + 1, abbr.length - 1);
	let abbrArray = split(abbrWithoutName);

	let children = new Array<Node>();

	abbrArray.forEach(abbr => {
		let child = abbr || '';
		children.push(getChildren(child));
	});

	let node = new Node(name, children);

	return node;
}

function split(abbr: string): string[] {
	let results = Array<string>();
	let str = '';
	let left = 0, right = 0;

	function keepResult() {
		results.push(str);
		str = '';
	}

	for (let i = 0; i < abbr.length; i++) {
		switch (abbr[i]) {
			case ',':
				if ((left === right)) {
					keepResult();
					left = right = 0;
				} else {
					str += abbr[i];
				}
				break;
			case '[':
				left++;
				str += abbr[i];
				break;
			case ']':
				right++;
				str += abbr[i];
				break;
			default:
				str += abbr[i];
		}
	}
	keepResult();
	return results;
}

function isSingleChild(abbr: string) {
	let symbolChild = abbr.indexOf(symbols.childBuilder);
	let symbolChildren = abbr.indexOf(symbols.childrenBuilder);

	if (symbolChild === -1 && symbolChildren === -1) {
		return true;
	}

	if (symbolChild === -1) {
		return false;
	}

	if (symbolChildren === -1) {
		return true;
	}

	return symbolChild < symbolChildren ? true : false;
}
