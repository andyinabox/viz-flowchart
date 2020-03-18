export default class VizFlowchartActor extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ['from', 'to']
  }
}

