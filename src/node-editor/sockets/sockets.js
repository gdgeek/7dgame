import Rete from 'rete'

var NumSocket = new Rete.Socket('Number')
var MetaSocket = new Rete.Socket('Meta')
var MetaKnightSocket = new Rete.Socket('MetaKnight')
var AbilitySocket = new Rete.Socket('Ability')
var EventSocket = new Rete.Socket('Event')
var EntitySocket = new Rete.Socket('Entity')
var AddonSocket = new Rete.Socket('Addon')
var ComponentSocket = new Rete.Socket('Component')
var ButtonSocket = new Rete.Socket('Button')
var ActionSocket = new Rete.Socket('Action')
var AnchorSocket = new Rete.Socket('Anchor')

export {
  ButtonSocket,
  AnchorSocket,
  NumSocket,
  MetaSocket,
  MetaKnightSocket,
  EntitySocket,
  AddonSocket,
  ComponentSocket,
  ActionSocket,
  EventSocket,
  AbilitySocket
}
