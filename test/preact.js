import '/dist/viz-flowchart.module.js'
import { html, render } from 'https://unpkg.com/htm/preact/standalone.module.js'
render(html`
<viz-flowchart>
  <viz-actor id="user">User</viz-actor>
  <viz-actor id="frontend">Frontend</viz-actor>
  <viz-actor id="tenent">Auth Server</viz-actor>
  <viz-actor id="api">API</viz-actor>

  <viz-step from="user" to="frontend">
    User clicks on the login link
  </viz-step>
  <viz-step from="frontend" to="frontend">
    User clicks on the login link
  </viz-step>
  <viz-step from="frontend" to="tenent">
    User clicks on the login link
  </viz-step>
  <viz-step from="tenent" to="api">
    User clicks on the login link
  </viz-step>
  <viz-step from="api" to="frontend">
    User clicks on the login link
  </viz-step>
  <viz-step from="frontend" to="user">
    User clicks on the login link
  </viz-step>
</viz-flowchart>
`, document.body)