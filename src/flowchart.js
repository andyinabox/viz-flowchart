import {
  getBandCenter,
  getActorIndex,
  getActorCenter,
  isHiddenStep,
  hasActionClass,
  isActionButton,
  parseChildren,
} from './utils.js'

const { 
  scaleBand,
  scaleOrdinal,
  range,
  create,
  select,
  path,
  schemeDark2,
} = window.d3

const defaults = {
  width: 800,
  circleRadius: 15,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 10,
  marginRight: 10,
  stepHeight: 120,
  flowArrowSize: 10,
  stepDescArrowSize: 13,
}

const template = `
<style>
svg {
  width: 100%;
  stroke-width: 1px;
  font-family: var(--main-font-family, 'Open Sans', Helvetica, Arial, sans-serif);
}

.actor-box {
  /* fill: #ddd; */
  opacity: 0.5;
  /* stroke: black; */
}

.actor-line {
  stroke: #ddd;
  stroke-width: 1px;
}

.actor-text {
  fill: black;
  text-align: center;
  font-size: 0.75rem;
  height: 0.75rem;
}

.hidden-step {
  transition: fill 200ms, stroke 200ms, opacity 200ms;
}

.step-line {
  /* stroke: black; */
  fill: none;
  stroke-width: 2px;
}

.step-line.hidden-step {
  stroke: #ccc
}

/* .step-circle { */
  /* stroke: black; */
  /* opacity: 0.5; */
/* } */

.step-circle.hidden-step {
  fill: white;
  stroke: #ccc;
}

.step-number {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  fill: white;
  line-height: 30px;
}

.step-number.hidden-step {
  fill: #ccc;
}

.step-desc {
  fill: black;
}

.step-desc.hidden-step {
  fill: #ccc;
}

.step-desc.action-button {
  fill: white;
  font-weight: bold;
  cursor: pointer;
}

.step-desc-bg {
  /* fill: white; */
  opacity: 0.5;
}

.step-desc-bg.hidden-step {
  opacity: 0;
  /* fill: none; */
}

.step-desc-bg.action-button {
  opacity: 1;
  fill: black;
  cursor: pointer;
}
</style>
<div class="viz-container"></div>
`

export default class VizFlowchart extends HTMLElement {
  constructor() {
    super();

    // set up shadow root
    this.attachShadow({ mode: 'open' });
    const { actors, steps } = parseChildren(this.children);
    this.shadowRoot.innerHTML = template;
    const el = this.shadowRoot.querySelector('.viz-container');

    Object.assign(this, {
      el,
      actors,
      steps
    })
    // set default options
    this.options = Object.assign({}, defaults)

    this.setup()
  }


  static get observedAttributes() {
    return ['step']
  }

  attributeChangedCallback() {
    this.update()
  }

  connectedCallback() {
    this.update()
  }

  setup() {

    const {
      el,
      steps,
      actors,
    } = this

    const {
      stepHeight,
      marginBottom,
      marginTop,
      width,
    } = this.options

    const actorHeight = stepHeight * .66;
    const stepDescFontSize = stepHeight/7;
    const height = (steps.length * stepHeight) + (actorHeight * 2) + marginTop + marginBottom;


    Object.assign(this.options, {
      actorHeight,
      stepDescFontSize,
      height,
    })

    const step = el.getAttribute('step') || steps.length-1
    this.currentStep = parseInt(step)

    this.actorsScale = scaleBand()
      .domain(range(actors.length))
      .range([0, width])
      .padding(0.25)

    this.stepsScale = scaleBand()
      .domain(range(steps.length))
      .range([stepHeight*1.5+marginTop, height])

    this.colorScale = scaleOrdinal(schemeDark2)


    const svg = create('svg')
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
    el.appendChild(svg.node())
    this.svg = svg

    this.createActors()
    this.updateSteps()
  }

  createActors() {

    const {
      marginTop,
      actorHeight,
      height,
      marginBottom,
    } = this.options

    const {
      svg,
      actors,
      actorsScale,
      colorScale,
    } = this

    const y = marginTop

    const actorsGroup = svg.append('g').attr('class', 'actors')

    // tops
    actorsGroup.append('g').attr('class', 'actor-boxes')
      .selectAll('.actor-box')
      .data(actors)
      .enter().append('rect')
        .attr('class', 'actor-box')
        .attr('height', actorHeight)
        .attr('width', actorsScale.bandwidth())
        .attr('fill', (d, i) => colorScale(i))
        .attr('x', (d, i) => actorsScale(i))
        .attr('y',  y)

    actorsGroup.append('g').attr('class', 'actor-texts')
      .selectAll('.actor-text')
      .data(actors)
      .enter().append('text')
        .attr('class', 'actor-text')
        .attr('x', (d, i) => getBandCenter(i, actorsScale))
        .attr('y',  y+(actorHeight/2))
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .text(d => d.title)
        
    actorsGroup.append('g').attr('class', 'actor-lines')
      .selectAll('.actor-line')
      .data(actors)
      .enter().append('line')
        .attr('class', 'actor-line')
        .attr('x1', (d, i) => getBandCenter(i, actorsScale))
        .attr('x2', (d, i) => getBandCenter(i, actorsScale))
        .attr('y1',  y+actorHeight)
        .attr('y2', height-marginBottom-actorHeight)
        .text(d => d.title)      

    // bottoms
    actorsGroup.append('g').attr('class', 'actor-boxes')
      .selectAll('.actor-box')
      .data(actors)
      .enter().append('rect')
        .attr('class', 'actor-box')
        .attr('height', actorHeight)
        .attr('width', actorsScale.bandwidth())
        .attr('fill', (d, i) => colorScale(i))
        .attr('x', (d, i) => actorsScale(i))
        .attr('y',  height-marginBottom-actorHeight)

    actorsGroup.append('g').attr('class', 'actor-texts')
      .selectAll('.actor-text')
      .data(actors)
      .enter().append('text')
        .attr('class', 'actor-text')
        .attr('x', (d, i) => getBandCenter(i, actorsScale))
        .attr('y',  height-marginBottom-actorHeight/2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .text(d => d.title)
  }

  updateSteps() {

    const {
      svg,
      actors,
      steps,
      actorsScale,
      stepsScale,
      currentStep,
      colorScale,
    } = this

    const {
      flowArrowSize,
      circleRadius,
      stepDescFontSize,
    } = this.options

    const stepsGroup = svg.append('g').attr('class', 'steps')

    const x1 = d => getActorCenter(d.from, actors, actorsScale)
    const x2 = d => getActorCenter(d.to, actors, actorsScale)
    const y1 = (d, i) => stepsScale(i)
    const isLoop = d => d.to === d.from

    const drawStepLine = (d, i) => {
      const p = path()
      const from = getActorIndex(d.from, actors)
      const to = getActorIndex(d.to, actors)

      if (from === to) {
        // p.moveTo(x1(d), stepsScale(i-1))
        // p.lineTo(x2(d), stepsScale(i+1)-circleRadius)
        p.arc(x1(d), stepsScale(i), stepsScale.bandwidth(), Math.PI/2, 3*Math.PI/2)
      } else {
        p.moveTo(x1(d), stepsScale(i))
        p.lineTo(x2(d), stepsScale(i))
        // if (i+1 < steps.length && !isLoop(steps[i+1])) p.lineTo(x2(d), stepsScale(i+1))
      }

      // arrowheads
      if (from < to) {
        p.moveTo(x2(d)-flowArrowSize, stepsScale(i)-flowArrowSize/2)
        p.lineTo(x2(d), stepsScale(i))
        p.lineTo(x2(d)-flowArrowSize, stepsScale(i)+flowArrowSize/2)
      } else if (to < from) {
        p.moveTo(x2(d)+flowArrowSize, stepsScale(i)-flowArrowSize/2)
        p.lineTo(x2(d), stepsScale(i))
        p.lineTo(x2(d)+flowArrowSize, stepsScale(i)+flowArrowSize/2)
      } else if (to === from) {
        // p.moveTo(x2(d)-flowArrowSize/2, stepsScale(i+1)-flowArrowSize-circleRadius)
        // p.lineTo(x2(d), stepsScale(i+1)-circleRadius)
        // p.lineTo(x2(d)+flowArrowSize/2, stepsScale(i+1)-flowArrowSize-circleRadius)
      }

      return p.toString()
    }

    stepsGroup.append('g').attr('class', 'step-lines')
      .selectAll('.step-line')
      .data(steps)
      .join(
        enter => enter.append('path')
          .attr('class', 'step-line')
          .classed('step-line-loop', d => isLoop(d))
          .classed('step-line-normal', d => !isLoop(d))
          .call(isHiddenStep, currentStep)
          .attr('stroke', d => colorScale(getActorIndex(d.from, actors)))
          .attr('d', drawStepLine),
        update => update.call(isHiddenStep, currentStep),
        exit => exit.remove()
      )

    stepsGroup.append('g').attr('class', 'step-circles')
      .selectAll('.step-circle')
      .data(steps)
      .join(
        enter => enter.append('circle')
          .attr('class', 'step-circle')
          .call(isHiddenStep, currentStep)
          .attr('fill', d => colorScale(getActorIndex(d.from, actors)))
          .attr('r', circleRadius)
          .attr('cx', x1)
          .attr('cy', y1),
        update => update.call(isHiddenStep, currentStep),
        exit => exit.remove()
      )

    stepsGroup.append('g').attr('class', 'step-numbers')
      .selectAll('.step-number')
      .data(steps)
      .join(
        enter => enter.append('text')
          .attr('class', 'step-number')
          .call(isHiddenStep, currentStep)
          .style('font-size', `${circleRadius*1.2}px`)
          .attr('x', x1)
          .attr('y', (d, i) => stepsScale(i) + 2)
          .text((d, i) => i+1)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle'),
        update => update.call(isHiddenStep, currentStep),
        exit => exit.remove()
      )
    
    stepsGroup.append('g').attr('class', 'step-desc-bgs')
      .selectAll('.step-desc-bg')
      .data(steps)
      .join(
        enter => enter.append('path')
          .attr('class', 'step-desc-bg')
          .call(hasActionClass, currentStep)
          .call(this.drawStepDescriptionBox.bind(this))
          .attr('fill', d => colorScale(getActorIndex(d.from, actors))),
          update => update
          .call(hasActionClass, currentStep),
        exit => exit.remove()
      )

    stepsGroup.append('g').attr('class', 'step-descs')
      .selectAll('.step-desc')
      .data(steps)
      .join(
        enter => enter.append('text')
          .attr('class', 'step-desc')
          .style('font-size', stepDescFontSize+'px')
          .call(hasActionClass, currentStep)
          .call(isActionButton)
          .attr('x', (svg.attr('width') / 2))
          .attr('y', (d, i) => stepsScale(i) - stepsScale.bandwidth()/2)
          .text(d  => d.desc)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle'),
        update => update
          .call(hasActionClass, currentStep)
          .call(isActionButton),
        exit => exit.remove()
      )
  }

  drawStepDescriptionBox(selector) {
    const {
      actors,
      actorsScale,
      stepsScale,
    } = this
    const {
      stepDescArrowSize,
      stepDescFontSize,
      marginRight,
      marginLeft,
      width,
    } = this.options

    selector.attr('d', (d, i) => {
      const p = path()
      const top = stepsScale(i) - (stepsScale.bandwidth()/2) - stepDescFontSize
      const bottom = top + stepDescFontSize*2
      const arrowPointX = getActorCenter(d.from, actors, actorsScale)
      p.moveTo(marginLeft, top)
      p.lineTo(width-marginRight, top)
      p.lineTo(width-marginRight, bottom)
      p.lineTo(arrowPointX + stepDescArrowSize/2, bottom)
      p.lineTo(arrowPointX, bottom+stepDescArrowSize)
      p.lineTo(arrowPointX - stepDescArrowSize/2, bottom)
      p.lineTo(marginLeft, bottom)
      p.closePath()
      return p.toString()
    })
  }

  update() {
    this.updateSteps()
  }
}
