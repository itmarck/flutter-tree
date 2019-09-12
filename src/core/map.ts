import { Node } from './node';
import { flag } from './constants';

export default function generateSnippet(rootNode: Node) {
    let snippet = map(rootNode);
    let count = 1;

    for (let i = 0; i < snippet.length; i++) {
        const char = snippet[i];
        if (char === flag) {
            snippet = snippet.replace(char, `$${count}`);
            count++;
        }
    }
    
    return snippet.replace(flag, '$1');
}

function map(rootNode: Node, tab: number = 1): string {
    let result = `${rootNode.name}(${flag}),`;

    if (rootNode.children) {
        if (rootNode.children instanceof Node) {
            let child = map(rootNode.children, tab + 1);
            let text = `\n${tabs(tab)}child: ${child}\n${tabs(tab - 1)}`;
            result = splice(result, text);
        } else if (rootNode.children) {
            let children = '';
            tab += 2;
            rootNode.children.forEach((child, index) => {
                if (index !== 0) {
                    children += '\n' + tabs(tab - 1);
                }
                children += map(child, tab);
            });
            tab -= 2;
            let text = `\n${tabs(tab)}children: <Widget>[\n${tabs(tab + 1)}${children}\n${tabs(tab)}],\n${tabs(tab - 1)}`;
            result = splice(result, text);
        }
    }

    return result;
}

function tabs(number: number): string {
    let string = '';
    for (let i = 0; i < number; i++) {
        string += '\t';
    }
    return string;
}

function splice(str: string, add: string): string {
    let index = str.indexOf(flag);
    return str.slice(0, index) + add + str.slice(index + 1);
}
