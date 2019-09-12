export class Node {

  name: string;
  children: Node | Node[] | undefined;

  constructor(name: string, children?: Node | Node[]) {
    this.name = name[0].toUpperCase() + name.slice(1);
    this.children = children;
  }

  isUnique() {
    return (this.children instanceof Node) ? true : false;
  }

}
