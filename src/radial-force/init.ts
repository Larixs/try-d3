import { createSvgElement } from 'utils/index'

export default function init(): void {
  const doc = document;
  const svg = createSvgElement('svg', {
    width: '960',
    height: '500',
    viewBox: '-480 -250 960 500',
  });
  const smallCircle = createSvgElement('circle', {
    r: '100',
    stroke: 'brown',
    'stroke-opacity': 0.5,
    fill: 'none'
  });
  const largeCircle = createSvgElement('circle', {
    r: '200',
    stroke: 'steelblue',
    'stroke-opacity': 0.5,
    fill: 'none'
  });
  svg.appendChild(smallCircle);
  svg.appendChild(largeCircle);
  doc.body.appendChild(svg);
}
