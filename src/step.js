export default class VizFlowchartStep extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ['id', 'title']
  }
}
