import VizFlowchart from './flowchart.js'
import VizFlowchartActor from './actor.js'
import VizFlowchartStep from './step.js'

customElements.define('viz-actor', VizFlowchartActor);
customElements.define('viz-step', VizFlowchartStep);
customElements.define('viz-flowchart', VizFlowchart);


// import { register, html, useRef, useEffect, useMemo, useCallback } from '/modules/preact.js'
// import * as d3 from '/vendor/d3.js'

// const { 
//   scaleBand,
//   scaleOrdinal,
//   range,
//   create,
//   select,
//   path,
//   schemeDark2,
// } = d3


// /*
// const sampleData = {
//   actors: [
//     { id: 'user', title: 'User', },
//     { id: 'frontend', title: 'Frontend' },
//     { id: 'tenent',  title: 'auth0 Tenent' },
//     { id: 'api', title: 'API' },
//   ],
//   steps: [
//     { from: 'user', to: 'user', desc: 'User visits site', type: 'interaction' },
//     { from: 'user', to: 'frontend', desc: 'User clicks on the login link', type: 'interaction', action: () => {} },
//     { from: 'frontend', to: 'frontend', desc: 'Frontend generates code verifier and code challenge ', type: 'automation' },
//     { from: 'frontend', to: 'tenent', desc: 'Redirect buser to /authorize with request data in query string', type: 'redirect' },
//     { from: 'tenent', to: 'user', desc: 'User sees the login form', type: 'response' },
//     { from: 'user', to: 'tenent', desc: 'User logs in / authenticates', type: 'interaction' },
//     { from: 'tenent', to: 'frontend', desc: 'User is redirected back to the SPA, with authorization code', type: 'redirect' },
//     { from: 'frontend', to: 'tenent', desc: 'Auth code + code verifier' },
//     { from: 'tenent', to: 'tenent', desc: 'Validate code verifier and challenge' },
//     { from: 'tenent', to: 'frontend', desc: 'ID token and access token' , action: () => {} },
//     { from: 'frontend', to: 'api', desc: 'Request data with access token'},
//     { from: 'api', to: 'frontend', desc: 'Response with data' },
//     { from: 'frontend', to: 'user', desc: 'User sees data' },
//   ]
// }
// */


// function FlowsChart(props) {

//   const {
//     width = 800,
//     circleRadius = 15,
//     marginTop = 0,
//     marginBottom = 0,
//     marginLeft = 10,
//     marginRight = 10,
//     stepHeight = 120,
//     children,
//   } = props

//   const data = props.data || parseChildren(children)


//   const {
//     actors,
//     steps,
//   } = data

//   const step = (typeof props.step !== 'undefined') ? step : steps.length-1
//   const actorHeight = stepHeight * .66

//   const currentStep = parseInt(step)
//   const el = useRef(null)
//   const svgRef = useRef(create('svg'))
//   const svg = svgRef.current

//   const stepDescFontSize = useMemo(() => stepHeight/7, [stepHeight])
//   const height = useMemo(
//     () => parseInt(props.height) || (steps.length * stepHeight) + (actorHeight * 2) + marginTop + marginBottom,
//     [steps, stepHeight, marginTop, marginBottom, props.height]
//   )

//   const actorsScale = useMemo(
//     () => scaleBand()
//       .domain(range(actors.length))
//       .range([0, width])
//       .padding(0.25),
//     [actors, width],
//   )

//   const stepsScale = useMemo(
//     () => scaleBand()
//        .domain(range(steps.length))
//        .range([stepHeight*1.5+marginTop, height]),
//     [steps, stepHeight, marginTop, height]
//   )

//   useEffect(() => {
//     if (el.current && svgRef.current) el.current.appendChild(svgRef.current.node())
//   }, [el.current, svgRef.current])

//   useEffect(() => {
//       svg
//         .attr('width', width)
//         .attr('height', height)
//         .attr('viewBox', `0 0 ${width} ${height}`)
//   }, [width, height])

  
//   useEffect(() => {
//     createActors(svg, actors)
//   }, [actors])

//   useEffect(() => {
//     updateSteps(svg, steps, currentStep)
//   }, [currentStep])

//   const drawStepDescriptionBox = useCallback((selector, scale, arrowSize, fontSize) => {
//     selector.attr('d', (d, i) => {
//       const p = path()
//       const top = scale(i) - (scale.bandwidth()/2) - fontSize
//       const bottom = top + fontSize*2
//       const arrowPointX = getActorCenter(d.from, actors, actorsScale)
//       p.moveTo(marginLeft, top)
//       p.lineTo(width-marginRight, top)
//       p.lineTo(width-marginRight, bottom)
//       p.lineTo(arrowPointX + arrowSize/2, bottom)
//       p.lineTo(arrowPointX, bottom+arrowSize)
//       p.lineTo(arrowPointX - arrowSize/2, bottom)
//       p.lineTo(marginLeft, bottom)
//       p.closePath()
//       return p.toString()
//     })
//   }, [actors, width, marginLeft, marginRight])

//   const createActors = useCallback((svg) => {
//     const y = marginTop

//     const actorsGroup = svg.append('g').attr('class', 'actors')

//     // tops
//     actorsGroup.append('g').attr('class', 'actor-boxes')
//       .selectAll('.actor-box')
//       .data(actors)
//       .enter().append('rect')
//         .attr('class', 'actor-box')
//         .attr('height', actorHeight)
//         .attr('width', actorsScale.bandwidth())
//         .attr('fill', (d, i) => colorScale(i))
//         .attr('x', (d, i) => actorsScale(i))
//         .attr('y',  y)

//     actorsGroup.append('g').attr('class', 'actor-texts')
//       .selectAll('.actor-text')
//       .data(actors)
//       .enter().append('text')
//         .attr('class', 'actor-text')
//         .attr('x', (d, i) => getBandCenter(i, actorsScale))
//         .attr('y',  y+(actorHeight/2))
//         .attr('dominant-baseline', 'middle')
//         .attr('text-anchor', 'middle')
//         .text(d => d.title)
        
//     actorsGroup.append('g').attr('class', 'actor-lines')
//       .selectAll('.actor-line')
//       .data(actors)
//       .enter().append('line')
//         .attr('class', 'actor-line')
//         .attr('x1', (d, i) => getBandCenter(i, actorsScale))
//         .attr('x2', (d, i) => getBandCenter(i, actorsScale))
//         .attr('y1',  y+actorHeight)
//         .attr('y2', height-marginBottom-actorHeight)
//         .text(d => d.title)      

//     // bottoms
//     actorsGroup.append('g').attr('class', 'actor-boxes')
//       .selectAll('.actor-box')
//       .data(actors)
//       .enter().append('rect')
//         .attr('class', 'actor-box')
//         .attr('height', actorHeight)
//         .attr('width', actorsScale.bandwidth())
//         .attr('fill', (d, i) => colorScale(i))
//         .attr('x', (d, i) => actorsScale(i))
//         .attr('y',  height-marginBottom-actorHeight)

//     actorsGroup.append('g').attr('class', 'actor-texts')
//       .selectAll('.actor-text')
//       .data(actors)
//       .enter().append('text')
//         .attr('class', 'actor-text')
//         .attr('x', (d, i) => getBandCenter(i, actorsScale))
//         .attr('y',  height-marginBottom-actorHeight/2)
//         .attr('dominant-baseline', 'middle')
//         .attr('text-anchor', 'middle')
//         .text(d => d.title)
        
//   }, [actors, stepHeight, height, marginBottom, marginTop])

//   const updateSteps = useCallback((svg, steps, currentStep) => {

//     const stepsGroup = svg.append('g').attr('class', 'steps')

//     const x1 = d => getActorCenter(d.from, actors, actorsScale)
//     const x2 = d => getActorCenter(d.to, actors, actorsScale)
//     const y1 = (d, i) => stepsScale(i)
//     const isLoop = d => d.to === d.from
//     const arrowSize = 10;

//     const drawStepLine = (d, i) => {
//       const p = path()
//       const from = getActorIndex(d.from, actors)
//       const to = getActorIndex(d.to, actors)

//       if (from === to) {
//         // p.moveTo(x1(d), stepsScale(i-1))
//         // p.lineTo(x2(d), stepsScale(i+1)-circleRadius)
//         p.arc(x1(d), stepsScale(i), stepsScale.bandwidth(), Math.PI/2, 3*Math.PI/2)
//       } else {
//         p.moveTo(x1(d), stepsScale(i))
//         p.lineTo(x2(d), stepsScale(i))
//         // if (i+1 < steps.length && !isLoop(steps[i+1])) p.lineTo(x2(d), stepsScale(i+1))
//       }

//       // arrowheads
//       if (from < to) {
//         p.moveTo(x2(d)-arrowSize, stepsScale(i)-arrowSize/2)
//         p.lineTo(x2(d), stepsScale(i))
//         p.lineTo(x2(d)-arrowSize, stepsScale(i)+arrowSize/2)
//       } else if (to < from) {
//         p.moveTo(x2(d)+arrowSize, stepsScale(i)-arrowSize/2)
//         p.lineTo(x2(d), stepsScale(i))
//         p.lineTo(x2(d)+arrowSize, stepsScale(i)+arrowSize/2)
//       } else if (to === from) {
//         // p.moveTo(x2(d)-arrowSize/2, stepsScale(i+1)-arrowSize-circleRadius)
//         // p.lineTo(x2(d), stepsScale(i+1)-circleRadius)
//         // p.lineTo(x2(d)+arrowSize/2, stepsScale(i+1)-arrowSize-circleRadius)
//       }

//       return p.toString()
//     }

//     stepsGroup.append('g').attr('class', 'step-lines')
//       .selectAll('.step-line')
//       .data(steps)
//       .join(
//         enter => enter.append('path')
//           .attr('class', 'step-line')
//           .classed('step-line-loop', d => isLoop(d))
//           .classed('step-line-normal', d => !isLoop(d))
//           .call(isHiddenStep, currentStep)
//           .attr('stroke', d => colorScale(getActorIndex(d.from, actors)))
//           .attr('d', drawStepLine),
//         update => update.call(isHiddenStep, currentStep),
//         exit => exit.remove()
//       )

//     stepsGroup.append('g').attr('class', 'step-circles')
//       .selectAll('.step-circle')
//       .data(steps)
//       .join(
//         enter => enter.append('circle')
//           .attr('class', 'step-circle')
//           .call(isHiddenStep, currentStep)
//           .attr('fill', d => colorScale(getActorIndex(d.from, actors)))
//           .attr('r', circleRadius)
//           .attr('cx', x1)
//           .attr('cy', y1),
//         update => update.call(isHiddenStep, currentStep),
//         exit => exit.remove()
//       )

//     stepsGroup.append('g').attr('class', 'step-numbers')
//       .selectAll('.step-number')
//       .data(steps)
//       .join(
//         enter => enter.append('text')
//           .attr('class', 'step-number')
//           .call(isHiddenStep, currentStep)
//           .style('font-size', `${circleRadius*1.2}px`)
//           .attr('x', x1)
//           .attr('y', (d, i) => stepsScale(i) + 2)
//           .text((d, i) => i+1)
//           .attr('dominant-baseline', 'middle')
//           .attr('text-anchor', 'middle'),
//         update => update.call(isHiddenStep, currentStep),
//         exit => exit.remove()
//       )
    
//     stepsGroup.append('g').attr('class', 'step-desc-bgs')
//       .selectAll('.step-desc-bg')
//       .data(steps)
//       .join(
//         enter => enter.append('path')
//           .attr('class', 'step-desc-bg')
//           .call(hasActionClass, currentStep)
//           .call(drawStepDescriptionBox, stepsScale, 13, stepDescFontSize)
//           .attr('fill', d => colorScale(getActorIndex(d.from, actors))),
//           update => update
//           .call(hasActionClass, currentStep),
//         exit => exit.remove()
//       )

//     stepsGroup.append('g').attr('class', 'step-descs')
//       .selectAll('.step-desc')
//       .data(steps)
//       .join(
//         enter => enter.append('text')
//           .attr('class', 'step-desc')
//           .style('font-size', stepDescFontSize+'px')
//           .call(hasActionClass, currentStep)
//           .call(isActionButton)
//           .attr('x', (svg.attr('width') / 2))
//           .attr('y', (d, i) => stepsScale(i) - stepsScale.bandwidth()/2)
//           .text(d  => d.desc)
//           .attr('dominant-baseline', 'middle')
//           .attr('text-anchor', 'middle'),
//         update => update
//           .call(hasActionClass, currentStep)
//           .call(isActionButton),
//         exit => exit.remove()
//       )
//   }, [actors, stepDescFontSize])

//   return html`
//     <style>
//       svg {
//         width: 100%;
//         stroke-width: 1px;
//         font-family: var(--main-font-family, 'Open Sans', Helvetica, Arial, sans-serif);
//       }

//       .actor-box {
//         /* fill: #ddd; */
//         opacity: 0.5;
//         /* stroke: black; */
//       }

//       .actor-line {
//         stroke: #ddd;
//         stroke-width: 1px;
//       }

//       .actor-text {
//         fill: black;
//         text-align: center;
//         font-size: 0.75rem;
//         height: 0.75rem;
//       }

//       .hidden-step {
//         transition: fill 200ms, stroke 200ms, opacity 200ms;
//       }

//       .step-line {
//         /* stroke: black; */
//         fill: none;
//         stroke-width: 2px;
//       }

//       .step-line.hidden-step {
//         stroke: #ccc
//       }

//       /* .step-circle { */
//         /* stroke: black; */
//         /* opacity: 0.5; */
//       /* } */

//       .step-circle.hidden-step {
//         fill: white;
//         stroke: #ccc;
//       }

//       .step-number {
//         font-family: 'Open Sans', Helvetica, Arial, sans-serif;
//         fill: white;
//         line-height: 30px;
//       }

//       .step-number.hidden-step {
//         fill: #ccc;
//       }

//       .step-desc {
//         fill: black;
//       }

//       .step-desc.hidden-step {
//         fill: #ccc;
//       }

//       .step-desc.action-button {
//         fill: white;
//         font-weight: bold;
//         cursor: pointer;
//       }

//       .step-desc-bg {
//         /* fill: white; */
//         opacity: 0.5;
//       }

//       .step-desc-bg.hidden-step {
//         opacity: 0;
//         /* fill: none; */
//       }

//       .step-desc-bg.action-button {
//         opacity: 1;
//         fill: black;
//         cursor: pointer;
//       }
//     </style>
//     <div class="d3-container" ref=${el}></div>
//   `
// }


// const colorScale = scaleOrdinal(schemeDark2)

// const getBandCenter = (index, band) => {
//   const start = band(index)
//   const width = band.bandwidth()
//   return start + (width/2)
// }

// // pretty sure there's a d3 function somewhere
// // that will do this
// const getActorIndex = (id, actors) => {
//   let i, index
//   for(i = 0; i < actors.length; i++){
//     if (actors[i].id === id) {
//       index = i
//       break;
//     }
//   }
//   return index
// }

// const getActorCenter = (id, actors, scale) => {
//   const index = getActorIndex(id, actors)
//   return getBandCenter(index, scale)
// }

// const isHiddenStep = (selector, currentStep) => {
//   selector.classed('hidden-step', (d, i) => (i > currentStep))
// }

// const hasActionClass = (selector, currentStep) => {
//   selector
//     .classed('action-button', (d, i) => (d.action && i === currentStep+1))
//     .classed('hidden-step', (d, i) => (i > currentStep+1))
// }

// const isActionButton = (selector) => {
//     selector.on('click', function(d) {
//       if(select(this).classed('action-button')) d.action(d)
//     })
// }

// const parseChildren = (children) => {
//   const data = {}

//   data.actors = children
//     .filter(a => (a.type === 'f-actor'))
//     .map(({ props }) => ({
//       id: props.id,
//       title: props.children[0].trim()
//   }))
//   data.steps = children
//     .filter(s => (s.type === 'f-step'))
//     .map(({ props }) => ({
//       from: props.from,
//       to: props.to,
//       desc: props.children[0].trim(),
//     }))

//   return data
// }

// function Actor() {
//   return html``
// }

// function Step() {
//   return html``
// }

// register(Actor, 'f-actor', ['from', 'to'])
// register(Step, 'f-step', ['id', 'title'])
// register(FlowsChart, 'f-chart', ['width', 'height', 'step'], { shadow: true })