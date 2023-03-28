import DataType from './type'

import Blockly from 'blockly'
const data = {
  name: 'set_text'
}
const block = {
  title: data.name,
  type: DataType.name,
  colour: DataType.colour,
  getBlockJson(parameters) {
    const json = {
      type: 'block_type',
      message0: '文本 %1 设置为 %2',
      args0: [
        {
          type: 'input_value',
          name: 'text',
          check: 'Text'
        },
        {
          type: 'field_input',
          name: 'value',
          text: 'default'
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: DataType.colour,
      tooltip: '',
      helpUrl: ''
    }
    return json
  },
  getBlock: function (parameters) {
    const data = {
      init: function () {
        const json = block.getBlockJson(parameters)
        this.jsonInit(json)
      }
    }
    return data
  },
  getLua(parameters) {
    const lua = function (block) {
      var value = block.getFieldValue('value')
      var text = Blockly.Lua.valueToCode(block, 'text', Blockly.Lua.ORDER_NONE)
      // TODO: Assemble Lua into code variable.
      var code = 'text.set_text(' + text + ',' + JSON.stringify(value) + ')\n'
      return code
    }
    return lua
  },
  toolbox: {
    kind: 'block',
    type: data.name
  }
}
export default block
