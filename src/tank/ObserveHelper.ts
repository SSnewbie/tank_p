export class ObserveHelper {
  content: any[];
  constructor() {
    this.content = [];
  }

  updated(content) {
    this.content = content;
  }

  get(name) {
    return this.content.filter(v => v.type === name);
  }
}
