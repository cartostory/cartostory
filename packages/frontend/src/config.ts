const trackOptions = {
  style: {
    plain: {
      color: '#5a5a66',
      dashArray: '6',
    },
    inBbox: {
      color: '#42b983',
      dashArray: '6',
    },
  },
}

const bboxOptions = {
  plain: {
    style: {
      color: '#5a5a66',
      fillOpacity: 0,
      dashArray: '5',
      weight: 2,
    },
  },
  hovered: {
    style: {
      color: '#5a5a66',
      fillColor: '#5a5a66',
      dashArray: '5',
      weight: 2,
    },
  },
  selected: {
    style: {
      color: '#42b983',
      fillColor: '#42b983',
      fillOpacity: 0,
      dashArray: '5',
      weight: 2,
    },
  },
}

export { bboxOptions, trackOptions }
