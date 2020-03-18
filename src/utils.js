export const getBandCenter = (index, band) => {
  const start = band(index)
  const width = band.bandwidth()
  return start + (width/2)
}

// pretty sure there's a d3 function somewhere
// that will do this
export const getActorIndex = (id, actors) => {
  let i, index
  for(i = 0; i < actors.length; i++){
    if (actors[i].id === id) {
      index = i
      break;
    }
  }
  return index
}

export const getActorCenter = (id, actors, scale) => {
  const index = getActorIndex(id, actors)
  return getBandCenter(index, scale)
}

export const isHiddenStep = (selector, currentStep) => {
  selector.classed('hidden-step', (d, i) => (i > currentStep))
}

export const hasActionClass = (selector, currentStep) => {
  selector
    .classed('action-button', (d, i) => (d.action && i === currentStep+1))
    .classed('hidden-step', (d, i) => (i > currentStep+1))
}

export const isActionButton = (selector) => {
    selector.on('click', function(d) {
      if(select(this).classed('action-button')) d.action(d)
    })
}

export const parseChildren = (nodes) => {
  const data = {}

  // converte NoteList to array
  const children =  Array.prototype.slice.call(nodes);
  
  data.actors = children
    .filter(c => (c.tagName.toLowerCase() === 'viz-actor'))
    .map(a => ({
      id: a.id,
      title: a.innerHTML.trim()
  }))
  data.steps = children
    .filter(c => (c.tagName.toLowerCase() === 'viz-step'))
    .map(s => ({
      from: s.getAttribute('from'),
      to:s.getAttribute('to'),
      desc:  s.innerHTML.trim(),
    }))

  return data
}

