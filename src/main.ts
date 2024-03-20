import './style.scss'
import { Engine } from './engine/Engine'
import { Exhibit } from './exhibit/Exhibit'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Exhibit,
  info: {
    twitter: undefined,
    github: 'https://github.com/isaackogan/NATS-1745-A-Canadian-Lens',
    title: undefined,
    description: undefined,
    documentTitle: 'Experience NATS',
  },
})
