import Type from './type'
import Blockly from 'blockly'
import PolygenEntity from './polygen_entity'

const PolygenCategory = {
  kind: 'category',
  name: '模型',
  colour: Type.colour,
  contents: [PolygenEntity.toolbox]
}
function RegisterData(root, index, data) {
  Blockly.Blocks[data.title] = data.getBlock(root)
  Blockly.Lua[data.title] = data.getLua(index)
}
function PolygenRegister(root, index) {
  RegisterData(root, index, PolygenEntity)
}
export { PolygenCategory, PolygenRegister }
